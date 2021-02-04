import { ParseOptionsError, UnAuthorizedError } from "@miqro/core";
import { Model, ModelCtor, Transaction } from "sequelize/types";
import { AccountModelService } from "./account";
import { ModelServiceArgs, ModelServiceOptions, ModelServicePostResult } from "./model";

export class CustomKeyAccountModelService extends AccountModelService {

  constructor(model: ModelCtor<Model<any, any>>, private readonly customKeys: string[], options?: ModelServiceOptions) {
    super(model, options);
  }

  public async post(args: ModelServiceArgs, transaction?: Transaction): Promise<ModelServicePostResult<any>> {
    if (!args.session) {
      throw new UnAuthorizedError(`no session!`);
    }
    const bodies: any[] = args.body instanceof Array ? args.body : [args.body];
    const where: any = { [this.modelIsDeletedAttribute]: true, [this.modelAccountAttribute]: args.session.account };
    for (const cK of this.customKeys) {
      where[cK] = bodies.map(b => b[cK])
    }
    const deleted = await this.model.findAll({
      where
    });

    if (deleted.length > 0) {
      for (const d of deleted) {
        let data;
        for (let i = 0; i < bodies.length; i++) {
          const b = bodies[i];
          let all = true;
          for (const cK of this.customKeys) {
            if (d.get(cK) !== b[cK]) {
              all = false;
              break;
            }
          }
          if (all) {
            data = b;
            bodies.splice(i, 1);
            break;
          }
        }
        if (!data || data.account) {
          throw new ParseOptionsError(`bad body`);
        }
        await d.update({
          [this.modelIsDeletedAttribute]: false,
          ...data
        })
      }
      if (bodies.length > 0) {
        return deleted.concat(await super.post({
          ...args,
          body: bodies as any
        }, transaction));
      } else {
        return deleted;
      }
    } else {
      return super.post(args, transaction);
    }
  }
}
