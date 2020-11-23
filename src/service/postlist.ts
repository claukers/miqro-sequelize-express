import {ModelService} from "./smodel";
import {ModelPostResult, ModelServiceArgs} from "./model";
import {parseOptions} from "@miqro/core";

export class PostListModelService extends ModelService {

  /* eslint-disable  @typescript-eslint/explicit-module-boundary-types */
  public async post(args: ModelServiceArgs, transaction?: any): Promise<ModelPostResult> {
    if (args.body instanceof Array) {
      parseOptions("params", args.params, [], "no_extra");
      parseOptions("query", args.query, [], "no_extra");
      // noinspection JSDeprecatedSymbols
      return this.model.bulkCreate(args.body, transaction ? {transaction} : undefined);
    } else {
      return super.post(args, transaction);
    }
  }
}
