import { Router } from "express";
import { createServiceResponseHandler, createServiceMethodHandler, IServiceHandler, IServiceRouteOptions, ServiceArg, ServiceResponse, APIRoute } from "miqro-express";
import { IModelService } from "miqro-sequelize";

export const createModelHandler = (service: IModelService, logger): IServiceHandler => {
  const router = Router();
  // Get All
  router.get("/", createServiceMethodHandler(service, "get", logger));
  // Get by Id
  router.get("/:id", createServiceMethodHandler(service, "get", logger));
  // Post
  router.post("/", createServiceMethodHandler(service, "post", logger));
  // Delete by id
  router.delete("/:id", createServiceMethodHandler(service, "delete", logger));
  // Patch by id
  router.patch("/:id", createServiceMethodHandler(service, "patch", logger));
  // Put
  router.put("/", createServiceMethodHandler(service, "put", logger));
  return router;
};

export class ModelRoute extends APIRoute {
  protected sendResponse: IServiceHandler = null;
  constructor(protected service: IModelService, options?: IServiceRouteOptions) {
    super(options);
    this.sendResponse = createServiceResponseHandler();
    this.use(undefined, [createModelHandler(service, this.logger), async (req, res) => {
      await this.sendResponse(req, res);
    }]);
  }
}
