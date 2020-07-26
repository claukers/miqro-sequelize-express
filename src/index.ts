import {Logger, MethodNotImplementedError} from "@miqro/core";
import {ModelServiceInterface} from "@miqro/database";
import {AsyncNextCallback, getResults, Handler, NextCallback, setResults} from "@miqro/handlers";

export const MapModelHandler = (callbackfn: (value: any, index: number, array: any[], req: any) => any, logger?: Logger): AsyncNextCallback => {
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
              rows: result.rows.map((value, index, array) => {
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
  return Handler(async (req) => {
    switch (req.method.toUpperCase()) {
      case "GET":
        return service.get(req);
      case "POST":
        return service.post(req);
      case "PATCH":
        return service.patch(req);
      case "PUT":
        return service.put(req);
      case "DELETE":
        return service.delete(req);
      default:
        throw new MethodNotImplementedError(`${req.method}`);
    }
  }, logger);
};
