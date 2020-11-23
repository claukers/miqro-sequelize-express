import {
  ConfigFileNotFoundError,
  ConfigPathResolver,
  getLogger,
  Logger,
  MethodNotImplementedError,
  SimpleMap
} from "@miqro/core";
import {AsyncNextCallback, getResults, Handler, NextCallback, setResults} from "@miqro/handlers";
import {ModelServiceArgs, ModelServiceInterface} from "./service";
import {Model, ModelCtor} from "sequelize";
import {existsSync} from "fs";

export * from "./audit";

export * from "./service";

export const loadModels = (sequelizercPath = ConfigPathResolver.getSequelizeRCFilePath()): SimpleMap<ModelCtor<Model<any>>> => {
  if (!existsSync(sequelizercPath)) {
    // noinspection SpellCheckingInspection
    throw new ConfigFileNotFoundError(`missing .sequelizerc file. maybe you didnt init your db config.`);
  } else {
    // noinspection SpellCheckingInspection
    /* eslint-disable  @typescript-eslint/no-var-requires */
    const sequelizerc = require(sequelizercPath);
    const modelsFolder = sequelizerc["models-path"];
    if (!existsSync(modelsFolder)) {
      throw new ConfigFileNotFoundError(`missing .sequelizerc["models-path"]=[${modelsFolder}] file. maybe you didnt init your db config.`);
    }
    return require(modelsFolder) as SimpleMap<ModelCtor<Model<any>>>;
  }
};

export const MapModelHandler = (callbackfn: (value: any, index: number, array: any[], req: any) => any): AsyncNextCallback => {
  return async (req, res, next) => {
    const results = getResults(req);
    if (results) {
      const mappedResults = results.map((result) => {
        if (!result) {
          return null;
        } else {
          if (result instanceof Array) {
            return result.map((value, index, array) => {
              return callbackfn(value, index, array, req);
            });
          } else if (result.rows instanceof Array) {
            return {
              count: result.count,
              rows: result.rows.map((value: any, index: number, array: any[]) => {
                return callbackfn(value, index, array, req);
              })
            };
          } else {
            const [ret] = [result].map((value, index, array) => {
              return callbackfn(value, index, array, req);
            });
            return ret;
          }
        }
      });
      setResults(req, mappedResults);
      next();
    }
  };
};

export const ModelHandler = (service: ModelServiceInterface, logger?: Logger): NextCallback => {
  logger = logger ? logger : getLogger("ModelHandler");
  return Handler(async (req) => {
    switch (req.method.toUpperCase()) {
      case "GET":
        return service.get(req as ModelServiceArgs);
      case "POST":
        return service.post(req as ModelServiceArgs);
      case "PATCH":
        return service.patch(req as ModelServiceArgs);
      case "PUT":
        return service.put(req as ModelServiceArgs);
      case "DELETE":
        return service.delete(req as ModelServiceArgs);
      default:
        throw new MethodNotImplementedError(`${req.method}`);
    }
  }, logger);
};
