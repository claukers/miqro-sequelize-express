import {APIRoute, createAPIHandler, createResponseHandler, createServiceFunctionHandler, IRouteOptions, IServiceHandler} from "miqro-express";
import {IModelService} from "miqro-sequelize";

export const createModelHandler = (service: IModelService, logger, config?: { options: IRouteOptions }): IServiceHandler => {
  const router = new APIRoute(config && config.options ? config.options : undefined);
  // Get All
  router.get("/", createServiceFunctionHandler(service, "get", logger, config));
  // Get by Id
  router.get("/:id", createServiceFunctionHandler(service, "get", logger, config));
  // Post
  router.post("/", createServiceFunctionHandler(service, "post", logger, config));
  // Delete by id
  router.delete("/:id", createServiceFunctionHandler(service, "delete", logger, config));
  // Patch by id
  router.patch("/:id", createServiceFunctionHandler(service, "patch", logger, config));
  // Put
  router.put("/", createServiceFunctionHandler(service, "put", logger, config));
  return router.routes();
};

export class ModelRoute extends APIRoute {
  protected sendResponse: IServiceHandler = null;

  constructor(protected service: IModelService, options?: IRouteOptions) {
    super(options);
    this.sendResponse = createResponseHandler(this.logger);
    this.router.use([
      createModelHandler(service, this.logger, {options}),
      createAPIHandler(async (req, res, next) => {
        await this.sendResponse(req, res, next);
      }, this.logger)[0]]);
  }
}
