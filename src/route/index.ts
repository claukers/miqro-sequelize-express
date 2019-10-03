import { Router } from "express";
import { Util } from "miqro-core";
import { IAPIRequest, IServiceHandler, IServiceRouteOptions, ServiceArg, ServiceResponse, ServiceRoute } from "miqro-express";
import { IModelService } from "miqro-sequelize";

export const createModelHandler = (service: IModelService, logger): IServiceHandler => {
  const router = Router();
  // Get All
  router.get("/", async (req: IAPIRequest, res) => {
    const ret = await service.get(new ServiceArg(req));
    logger.debug(`${req.method} handler ret [${ret}]`);
    await new ServiceResponse(ret).send(res);
  });
  // Get by Id
  router.get("/:id", async (req: IAPIRequest, res) => {
    const ret = await service.get(new ServiceArg(req));
    logger.debug(`${req.method} handler ret [${ret}]`);
    await new ServiceResponse(ret).send(res);
  });
  // Post
  router.post("/", async (req: IAPIRequest, res) => {
    const ret = await service.post(new ServiceArg(req));
    logger.debug(`${req.method} handler ret [${ret}]`);
    await new ServiceResponse(ret).send(res);
  });
  // Delete by id
  router.delete("/:id", async (req: IAPIRequest, res) => {
    const ret = await service.delete(new ServiceArg(req));
    logger.debug(`${req.method} handler ret [${ret}]`);
    await new ServiceResponse(ret).send(res);
  });
  // Patch by id
  router.patch("/:id", async (req: IAPIRequest, res) => {
    const ret = await service.patch(new ServiceArg(req));
    logger.debug(`${req.method} handler ret [${ret}]`);
    await new ServiceResponse(ret).send(res);
  });
  // Patch by id
  router.put("/", async (req: IAPIRequest, res) => {
    const ret = await service.put(new ServiceArg(req));
    logger.debug(`${req.method} handler ret [${ret}]`);
    await new ServiceResponse(ret).send(res);
  });
  return router;
};

export class ModelRoute extends ServiceRoute {
  constructor(protected service: IModelService, options?: IServiceRouteOptions) {
    super(options);
    const logger = Util.getLogger("ModelServiceRoute");
    this.use(undefined, createModelHandler(this.service, logger));
  }
}
