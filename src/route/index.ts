import { Router } from "express";
import { APIRoute, createResponseHandler, createServiceFunctionHandler, IServiceHandler, IServiceRouteOptions, ServiceArg, ServiceResponse } from "miqro-express";
import { IModelService } from "miqro-sequelize";

export const createModelHandler = (service: IModelService, logger): IServiceHandler => {
  const router = Router();
  // Get All
  router.get("/", createServiceFunctionHandler(service, "get", logger));
  // Get by Id
  router.get("/:id", createServiceFunctionHandler(service, "get", logger));
  // Post
  router.post("/", createServiceFunctionHandler(service, "post", logger));
  // Delete by id
  router.delete("/:id", createServiceFunctionHandler(service, "delete", logger));
  // Patch by id
  router.patch("/:id", createServiceFunctionHandler(service, "patch", logger));
  // Put
  router.put("/", createServiceFunctionHandler(service, "put", logger));
  return router;
};

export class ModelRoute extends APIRoute {
  protected sendResponse: IServiceHandler = null;
  constructor(protected service: IModelService, options?: IServiceRouteOptions) {
    super(options);
    this.sendResponse = createResponseHandler(this.logger);
    this.use(undefined, [createModelHandler(service, this.logger), async (req, res) => {
      await this.sendResponse(req, res);
    }]);
  }
}
