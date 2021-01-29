import {
  ModelServiceDeleteResult,
  ModelServiceGetResult,
  ModelServicePatchResult,
  ModelServicePostResult,
  ModelServiceArgs,
  ModelServiceInterface
} from "./model";
import { MethodNotImplementedError } from "@miqro/core";

export abstract class AbstractModelService<T = any, T2 = any> implements ModelServiceInterface<T, T2> {
  // noinspection JSUnusedLocalSymbols
  /* eslint-disable  @typescript-eslint/no-unused-vars */
  public async get(options: ModelServiceArgs): Promise<ModelServiceGetResult<T, T2>> {
    throw new MethodNotImplementedError("Method not implemented.");
  }

  // noinspection JSUnusedLocalSymbols
  public async post(options: ModelServiceArgs): Promise<ModelServicePostResult<T, T2>> {
    throw new MethodNotImplementedError("Method not implemented.");
  }

  // noinspection JSUnusedLocalSymbols
  public async put(options: ModelServiceArgs): Promise<ModelServicePostResult<T, T2>> {
    throw new MethodNotImplementedError("Method not implemented.");
  }

  // noinspection JSUnusedLocalSymbols
  public async patch(options: ModelServiceArgs): Promise<ModelServicePatchResult<T, T2>> {
    throw new MethodNotImplementedError("Method not implemented.");
  }

  // noinspection JSUnusedLocalSymbols
  public async delete(options: ModelServiceArgs): Promise<ModelServiceDeleteResult | ModelServicePatchResult<T, T2>> {
    throw new MethodNotImplementedError("Method not implemented.");
  }
}
