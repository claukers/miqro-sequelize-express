import { IServiceArgs } from "miqro-express";
import { ModelService } from "./service";

export class FakeDeleteModelService extends ModelService {
  protected modelIsDeletedAttribute: string = "deleted";
  public async get(args: IServiceArgs) {
    // select with where [modelIsDeletedAttribute]=false
    if (args && args.params) {
      args.params[this.modelIsDeletedAttribute] = false;
    } else if (!args.params) {
      args.params = {
        [this.modelIsDeletedAttribute]: false
      };
    }
    return super.get(args);
  }
  public async delete(args: IServiceArgs) {
    // update with set [modelIsDeletedAttribute]=true
    return super.patch({
      body: {
        [this.modelIsDeletedAttribute]: false
      },
      headers: args.headers,
      params: args.params,
      query: args.query,
      session: args.session
    });
  }
  public async post(args: IServiceArgs) {
    // insert with [modelIsDeletedAttribute]=false
    if (args && args.body) {
      args.body[this.modelIsDeletedAttribute] = false;
    }
    return super.post(args);
  }
}
