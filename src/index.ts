import {
  getLogger,
  Logger,
  MethodNotImplementedError,
} from "@miqro/core";
import { getResults, Handler, NextCallback, NextHandler, setResults, ParseResultsHandlerOptions } from "@miqro/handlers";
import { ModelServiceArgs, ModelServiceInterface } from "./service";

export * from "./audit";

export * from "./service";

export const MapModelHandler = (callbackfn: (value: any, index: number, array: any[], req: any) => any): NextCallback => {
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
  },);
};

export const ModelHandler = (service: ModelServiceInterface): NextCallback => {
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
  });
};

export const IdModelMapper = (): NextCallback => MapModelHandler(({ id }) => {
  return { id };
});

export const CountModelMapper = (): NextCallback => MapModelHandler((item: any) => {
  return { count: item.count };
});
