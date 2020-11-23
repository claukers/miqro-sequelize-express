import {
  ModelDeleteResult,
  ModelGetResult,
  ModelPatchResult,
  ModelPostResult,
  ModelServiceArgs,
  ModelServiceInterface
} from "./model";
import {MethodNotImplementedError} from "@miqro/core";

export abstract class AbstractModelService implements ModelServiceInterface {
  // noinspection JSUnusedLocalSymbols
  /* eslint-disable  @typescript-eslint/no-unused-vars */
  public async get(options: ModelServiceArgs): Promise<ModelGetResult> {
    throw new MethodNotImplementedError("Method not implemented.");
  }

  // noinspection JSUnusedLocalSymbols
  public async post(options: ModelServiceArgs): Promise<ModelPostResult> {
    throw new MethodNotImplementedError("Method not implemented.");
  }

  // noinspection JSUnusedLocalSymbols
  public async put(options: ModelServiceArgs): Promise<ModelPostResult> {
    throw new MethodNotImplementedError("Method not implemented.");
  }

  // noinspection JSUnusedLocalSymbols
  public async patch(options: ModelServiceArgs): Promise<ModelPatchResult> {
    throw new MethodNotImplementedError("Method not implemented.");
  }

  // noinspection JSUnusedLocalSymbols
  public async delete(options: ModelServiceArgs): Promise<ModelDeleteResult> {
    throw new MethodNotImplementedError("Method not implemented.");
  }
}
