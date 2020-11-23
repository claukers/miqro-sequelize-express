import {FakeDeleteModelService} from "./deleted";
import {ModelGetResult, ModelPatchResult, ModelPostResult, ModelServiceArgs} from "./model";
import {ParseOptionsError} from "@miqro/core";


export class AccountModelService extends FakeDeleteModelService {
  public async get(args: ModelServiceArgs, transaction?: any, skipLocked?: boolean): Promise<ModelGetResult> {
    if (!args.session) {
      throw new ParseOptionsError("req.session not valid");
    }
    args.params.account = args.session.account;
    return super.get(args, transaction, skipLocked);
  }

  public post(args: ModelServiceArgs, transaction?: any): Promise<ModelPostResult> {
    if (args.body instanceof Array) {
      args.body = args.body.map(body => {
        if (!args.session) {
          throw new ParseOptionsError("req.session not valid");
        }
        body.account = args.session.account;
        return body;
      }) as any;
    } else {
      if (!args.session) {
        throw new ParseOptionsError("req.session not valid");
      }
      args.body.account = args.session.account;
    }
    return super.post(args, transaction);
  }

  public patch(args: ModelServiceArgs, transaction?: any): Promise<ModelPatchResult> {
    if (!args.session) {
      throw new ParseOptionsError("req.session not valid");
    }
    args.params.account = args.session.account;
    args.body.account = args.session.account;
    return super.patch(args, transaction);
  }

  public delete(args: ModelServiceArgs, transaction?: any): Promise<ModelPatchResult> {
    if (!args.session) {
      throw new ParseOptionsError("req.session not valid");
    }
    args.params.account = args.session.account;
    return super.delete(args, transaction);
  }
}
