import {MethodNotImplementedError} from "@miqro/core";
import {IModelService} from "@miqro/database";
import {
  getResults,
  Handler,
  INextHandlerCallback,
  NextErrorHandler,
  setResults
} from "@miqro/handlers";

export const MapModelHandler = (callbackfn: (value: any, index: number, array: any[], req: any) => any, logger?: any): INextHandlerCallback => {
  return NextErrorHandler(async (req, res, next) => {
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
  }, logger);
};

export const ModelHandler = (service: IModelService, logger?): INextHandlerCallback => {
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
