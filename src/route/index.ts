import {Router} from "express";
import {MethodNotImplementedError} from "miqro-core";
import {Handler, ResponseHandler} from "miqro-express";
import {IModelService} from "miqro-sequelize";

export const ModelHandler = (service: IModelService, logger?) => {
  return Handler(async (req) => {
    switch (req.method.toUpperCase()) {
      case "GET":
        return service.get(req as any);
      case "POST":
        return service.post(req as any);
      case "PATCH":
        return service.patch(req as any);
      case "PUT":
        return service.put(req as any);
      case "DELETE":
        return service.delete(req as any);
      default:
        throw new MethodNotImplementedError(`method[${req.method}] not implemented`);
    }
  }, logger);
};

export const ModelRouter = (service: IModelService, router?: Router, logger?) => {
  if (!router) {
    router = Router();
  }
  router.get("/", [ModelHandler(service, logger), ResponseHandler(logger)]);
  router.get("/:id", [ModelHandler(service, logger), ResponseHandler(logger)]);
  router.patch("/", [ModelHandler(service, logger), ResponseHandler(logger)]);
  router.post("/", [ModelHandler(service, logger), ResponseHandler(logger)]);
  router.put("/", [ModelHandler(service, logger), ResponseHandler(logger)]);
  router.delete("/", [ModelHandler(service, logger), ResponseHandler(logger)]);
  return router;
};
