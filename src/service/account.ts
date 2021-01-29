import { FakeDeleteModelService } from "./deleted";
import { Transaction } from "sequelize";
import { ModelServiceArgs, ModelServiceGetResult, ModelServicePatchResult, ModelServicePostResult } from "./model";
import { parseOptions, ParseOptionsError, Session } from "@miqro/core";


export class AccountModelService<T = any, T2 = any> extends FakeDeleteModelService<T, T2> {

  protected modelAccountAttribute = "account";

  public async get(args: ModelServiceArgs, transaction?: Transaction, skipLocked?: boolean): Promise<ModelServiceGetResult<T, T2>> {
    parseOptions("body", args.body, [], "no_extra");
    if (!args.session) {
      throw new ParseOptionsError("req.session not valid");
    }
    if (args.params[this.modelAccountAttribute] !== undefined) {
      throw new ParseOptionsError(`not valid params.${this.modelAccountAttribute}`);
    }
    args.params[this.modelAccountAttribute] = args.session.account;
    return super.get(args, transaction, skipLocked);
  }

  public post(args: ModelServiceArgs, transaction?: Transaction): Promise<ModelServicePostResult<T, T2>> {
    parseOptions("params", args.params, [], "no_extra");
    parseOptions("query", args.query, [], "no_extra");
    if (!args.session) {
      throw new ParseOptionsError("req.session not valid");
    }
    if (args.body instanceof Array) {
      args.body = args.body.map(body => {
        if (body[this.modelAccountAttribute] !== undefined) {
          throw new ParseOptionsError(`not valid body[...].${this.modelAccountAttribute}`);
        }
        body[this.modelAccountAttribute] = (args.session as Session).account;
        return body;
      }) as any;
    } else {
      if (args.body[this.modelAccountAttribute] !== undefined) {
        throw new ParseOptionsError(`not valid body.${this.modelAccountAttribute}`);
      }
      args.body[this.modelAccountAttribute] = args.session.account;
    }
    return super.post(args, transaction);
  }

  public patch(args: ModelServiceArgs, transaction?: Transaction): Promise<ModelServicePatchResult<T, T2>> {
    parseOptions("query", args.query, [], "no_extra");
    if (!args.session) {
      throw new ParseOptionsError("req.session not valid");
    }
    if (args.params[this.modelAccountAttribute] !== undefined) {
      throw new ParseOptionsError(`not valid params.${this.modelAccountAttribute}`);
    }
    if (args.body[this.modelAccountAttribute] !== undefined) {
      throw new ParseOptionsError(`not valid body.${this.modelAccountAttribute}`);
    }

    args.params[this.modelAccountAttribute] = args.session.account;
    args.body[this.modelAccountAttribute] = args.session.account;
    return super.patch(args, transaction);
  }

  public delete(args: ModelServiceArgs, transaction?: Transaction): Promise<ModelServicePatchResult<T, T2>> {
    parseOptions("query", args.query, [], "no_extra");
    parseOptions("body", args.body, [], "no_extra");
    if (!args.session) {
      throw new ParseOptionsError("req.session not valid");
    }
    if (args.params[this.modelAccountAttribute] !== undefined) {
      throw new ParseOptionsError(`not valid params.${this.modelAccountAttribute}`);
    }
    args.params[this.modelAccountAttribute] = args.session.account;
    return super.delete(args, transaction);
  }
}
