import {
  ConfigFileNotFoundError,
  ConfigPathResolver,
  getLogger,
  LoaderCache,
  loadSequelizeRC,
  Logger,
  MethodNotImplementedError,
  SimpleMap
} from "@miqro/core";
import {getResults, Handler, NextCallback, NextHandler, setResults} from "@miqro/handlers";
import {ModelServiceArgs, ModelServiceInterface} from "./service";
import {Model, ModelCtor} from "sequelize";
import {existsSync} from "fs";

export * from "./audit";

export * from "./service";

export const loadModels = (sequelizercPath = ConfigPathResolver.getSequelizeRCFilePath(), logger?: Logger): SimpleMap<ModelCtor<Model<any>>> => {
  if (LoaderCache.extra.models === undefined) {
    if (!existsSync(sequelizercPath)) {
      // noinspection SpellCheckingInspection
      throw new ConfigFileNotFoundError(`missing .sequelizerc file. maybe you didnt init your db config.`);
    } else {
      const config = loadSequelizeRC(sequelizercPath, logger);
      if (!existsSync(config.modelsFolder)) {
        throw new ConfigFileNotFoundError(`missing .sequelizerc["models-path"]=[${config.modelsFolder}] file. maybe you didnt init your db config.`);
      }
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      LoaderCache.extra.models = require(config.modelsFolder) as SimpleMap<ModelCtor<Model<any>>>;
      return LoaderCache.extra.models;
    }
  } else {
    return LoaderCache.extra.models as SimpleMap<ModelCtor<Model<any>>>;
  }

};

export const MapModelHandler = (callbackfn: (value: any, index: number, array: any[], req: any) => any, logger?: Logger): NextCallback => {
  logger = logger ? logger : getLogger("MapModelHandler");
  return NextHandler(async (req, res, next) => {
    const results = getResults(req);
    if (results) {
      const mappedResults = results.map((result, index, array) => {
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
            return callbackfn(result, index, array, req);
          }
        }
      });
      setResults(req, mappedResults);
      next();
    }
  }, logger);
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
