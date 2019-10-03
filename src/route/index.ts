import { Router } from "express";
import { Util } from "miqro-core";
import { IServiceHandler, IServiceRouteOptions, ServiceArg, ServiceResponse, ServiceRoute, createAPIHandler } from "miqro-express";
import { IModelService } from "miqro-sequelize";

export const createModelHandler = (service: IModelService, logger): IServiceHandler => {
  const router = Router();
  // Get All
  router.get("/", async (req, res, next) => {
    const ret = await service.get(new ServiceArg(req));
    logger.debug(`${req.method} modelservice set req.instance=[${ret}]`);
    (req as any).instance = ret;
    next();
  });
  // Get by Id
  router.get("/:id", async (req, res, next) => {
    const ret = await service.get(new ServiceArg(req));
    logger.debug(`${req.method} modelservice set req.instance=[${ret}]`);
    (req as any).instance = ret;
    next();
  });
  // Post
  router.post("/", async (req, res, next) => {
    const ret = await service.post(new ServiceArg(req));
    logger.debug(`${req.method} modelservice set req.instance=[${ret}]`);
    (req as any).instance = ret;
    next();
  });
  // Delete by id
  router.delete("/:id", async (req, res, next) => {
    const ret = await service.delete(new ServiceArg(req));
    logger.debug(`${req.method} modelservice set req.instance=[${ret}]`);
    next();
  });
  // Patch by id
  router.patch("/:id", async (req, res, next) => {
    const ret = await service.patch(new ServiceArg(req));
    logger.debug(`${req.method} modelservice set req.instance=[${ret}]`);
    (req as any).instance = ret;
    next();
  });
  // Put
  router.put("/", async (req, res, next) => {
    const ret = await service.put(new ServiceArg(req));
    logger.debug(`${req.method} modelservice set req.instance=[${ret}]`);
    (req as any).instance = ret;
    next();
  });
  return router;
};

export class ModelRoute extends ServiceRoute {
  constructor(protected service: IModelService, options?: IServiceRouteOptions) {
    super(options);
    const logger = Util.getLogger("ModelServiceRoute");
    this.router.use([createAPIHandler(createModelHandler(this.service, logger), this), async (req, res) => {
      await this.finalHandler(req, res);
    }]);
  }
  protected async end(req, res) {
    await new ServiceResponse(req.instance).send(res);
  }
}
