import {ModelServiceArgs, ModelServiceGetResult, ModelServicePatchResult, ModelServicePostResult} from "./model";
import {Transaction} from "sequelize";
import {ModelService} from "./smodel";
import {parseOptions, ParseOptionsError} from "@miqro/core";

export class FakeDeleteModelService<T = any> extends ModelService<T> {
  protected modelIsDeletedAttribute = "deleted";

  public async get(args: ModelServiceArgs, transaction?: Transaction, skipLocked?: boolean): Promise<ModelServiceGetResult<T>> {
    parseOptions("body", args.body, [], "no_extra");
    if (args.params[this.modelIsDeletedAttribute] !== undefined) {
      throw new ParseOptionsError(`not valid params.${this.modelIsDeletedAttribute}`);
    }
    args.params[this.modelIsDeletedAttribute] = false;
    return super.get(args, transaction, skipLocked);
  }

  public async delete(args: ModelServiceArgs, transaction?: Transaction): Promise<ModelServicePatchResult> {
    parseOptions("query", args.query, [], "no_extra");
    parseOptions("body", args.body, [], "no_extra");
    if (args.params[this.modelIsDeletedAttribute] !== undefined) {
      throw new ParseOptionsError(`not valid params.${this.modelIsDeletedAttribute}`);
    }
    args.params[this.modelIsDeletedAttribute] = false;

    args.body[this.modelIsDeletedAttribute] = true;
    return super.patch(args, transaction);
  }

  public async patch(args: ModelServiceArgs, transaction?: Transaction): Promise<ModelServicePatchResult> {
    parseOptions("query", args.query, [], "no_extra");
    if (args.params[this.modelIsDeletedAttribute] !== undefined) {
      throw new ParseOptionsError(`not valid params.${this.modelIsDeletedAttribute}`);
    }
    args.params[this.modelIsDeletedAttribute] = false;

    if (args.body[this.modelIsDeletedAttribute]) {
      delete args.body[this.modelIsDeletedAttribute];
    }
    return super.patch(args, transaction);
  }

  public async post(args: ModelServiceArgs, transaction?: Transaction): Promise<ModelServicePostResult<T>> {
    parseOptions("params", args.params, [], "no_extra");
    parseOptions("query", args.query, [], "no_extra");
    if (args.body instanceof Array) {
      for (const rBody of args.body) {
        rBody[this.modelIsDeletedAttribute] = false;
      }
    } else {
      args.body[this.modelIsDeletedAttribute] = false;
    }
    return super.post(args, transaction);
  }
}
