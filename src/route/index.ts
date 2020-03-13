import {MethodNotImplementedError} from "@miqro/core";
import {IModelService} from "@miqro/database";
import {
  getResults,
  Handler,
  INextHandlerCallback,
  NextErrorHandler,
  ResponseHandler,
  setResults
} from "@miqro/handlers";
import {Router} from "express";

export const MapModelHandler = (callbackfn: (value: any, index: number, array: any[]) => any, logger?: any): INextHandlerCallback => {
  return NextErrorHandler(async (req, res, next) => {
    const results = getResults(req);
    if (results) {
      const mappedResults = results.map((result) => {
        if (!result) {
          return null;
        } else {
          if (result instanceof Array) {
            return result.map(callbackfn);
          } else if (result.rows instanceof Array) {
            return {
              count: result.count,
              rows: result.rows.map(callbackfn)
            };
          } else {
            const [ret] = [result].map(callbackfn);
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

export const ModelRouter = (service: IModelService, router?: Router, logger?) => {
  if (!router) {
    router = Router();
  }
  router.get("/:id", [ModelHandler(service, logger), ResponseHandler(logger)]);
  router.get("/", [ModelHandler(service, logger), ResponseHandler(logger)]);
  router.patch("/:id", [ModelHandler(service, logger), ResponseHandler(logger)]);
  router.post("/:id", [ModelHandler(service, logger), ResponseHandler(logger)]);
  router.put("/:id", [ModelHandler(service, logger), ResponseHandler(logger)]);
  router.delete("/:id", [ModelHandler(service, logger), ResponseHandler(logger)]);
  return router;
};
