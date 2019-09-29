import { IServiceArgs } from "miqro-express";

export interface IModelService {
  get(options: IServiceArgs): Promise<any>;
  post(options: IServiceArgs): Promise<any>;
  put(options: IServiceArgs): Promise<any>;
  patch(options: IServiceArgs): Promise<any>;
  delete(options: IServiceArgs): Promise<any>;
}
