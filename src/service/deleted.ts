import {PostListModelService} from "./postlist";
import {ModelGetResult, ModelPatchResult, ModelPostResult, ModelServiceArgs} from "./model";

export class FakeDeleteModelService extends PostListModelService {
  protected modelIsDeletedAttribute = "deleted";

  public async get(args: ModelServiceArgs, transaction?: any, skipLocked?: boolean): Promise<ModelGetResult> {
    args.params[this.modelIsDeletedAttribute] = false;
    return super.get(args, transaction, skipLocked);
  }

  public async delete(args: ModelServiceArgs, transaction?: any): Promise<ModelPatchResult> {
    args.body[this.modelIsDeletedAttribute] = true;
    return super.patch(args, transaction);
  }

  public async patch(args: ModelServiceArgs, transaction?: any): Promise<ModelPatchResult> {
    if (args.body[this.modelIsDeletedAttribute]) {
      delete args.body[this.modelIsDeletedAttribute];
    }
    return super.patch(args, transaction);
  }

  public async post(args: ModelServiceArgs, transaction?: any): Promise<ModelPostResult> {
    if (args.body instanceof Array) {
      for (const rBody of args.body) {
        rBody[this.modelIsDeletedAttribute] = false;
      }
      return super.post(args, transaction);
    } else {
      args.body[this.modelIsDeletedAttribute] = false;
      return super.post(args, transaction);
    }
  }
}
