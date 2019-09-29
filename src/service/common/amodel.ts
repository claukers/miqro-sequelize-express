import { IServiceArgs, MethodNotImplementedError } from "miqro-express";
import { IModelService } from "./model";

export abstract class AbstractModelService implements IModelService {
  public async get(options: IServiceArgs): Promise<any> {
    throw new MethodNotImplementedError("Method not implemented.");
  }
  public async post(options: IServiceArgs): Promise<any> {
    throw new MethodNotImplementedError("Method not implemented.");
  }
  public async put(options: IServiceArgs): Promise<any> {
    throw new MethodNotImplementedError("Method not implemented.");
  }
  public async patch(options: IServiceArgs): Promise<any> {
    throw new MethodNotImplementedError("Method not implemented.");
  }
  public async delete(options: IServiceArgs): Promise<any> {
    throw new MethodNotImplementedError("Method not implemented.");
  }
}
