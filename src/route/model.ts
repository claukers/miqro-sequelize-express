import { Util } from "miqro-core";
import { IAPIRequest, IServiceRouteOptions, ServiceArg, ServiceResponse, ServiceRoute } from "miqro-express";
import { IModelService } from "miqro-sequelize";
import { IModelRoute, setupModelRouter } from "./common";

export class ModelRoute extends ServiceRoute implements IModelRoute {
  private logger = null;
  constructor(protected service: IModelService, options?: IServiceRouteOptions) {
    super(options);
    if (!this.logger) {
      this.logger = Util.getLogger("ModelServiceRoute");
    }
    setupModelRouter(this, this);
  }
  public async getInstance(req: IAPIRequest, res) {
    const ret = await this.service.get(new ServiceArg(req));
    this.logger.debug(`${req.method} handler ret [${ret}]`);
    await new ServiceResponse(ret).send(res);
  }
  public async postInstance(req: IAPIRequest, res) {
    const ret = await this.service.post(new ServiceArg(req));
    this.logger.debug(`${req.method} handler ret [${ret}]`);
    await new ServiceResponse(ret).send(res);
  }
  public async deleteInstance(req: IAPIRequest, res) {
    const ret = await this.service.delete(new ServiceArg(req));
    this.logger.debug(`${req.method} handler ret [${ret}]`);
    await new ServiceResponse(ret).send(res);
  }
  public async patchInstance(req: IAPIRequest, res) {
    const ret = await this.service.patch(new ServiceArg(req));
    this.logger.debug(`${req.method} handler ret [${ret}]`);
    await new ServiceResponse(ret).send(res);
  }
  public async putInstance(req: IAPIRequest, res) {
    const ret = await this.service.put(new ServiceArg(req));
    this.logger.debug(`${req.method} handler ret [${ret}]`);
    await new ServiceResponse(ret).send(res);
  }
}
