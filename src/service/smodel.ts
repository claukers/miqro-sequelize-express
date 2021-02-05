import { AbstractModelService } from "./amodel";
import {
  ATTRIBUTE_OPTIONS,
  GROUP_OPTIONS,
  ModelServiceArgs,
  ModelServiceDeleteResult,
  ModelServiceGetResult,
  ModelServiceOptions,
  ModelServicePatchResult,
  ModelServicePostResult,
  ORDER_OPTIONS,
  PAGINATION_OPTIONS,
  SEARCH_OPTIONS
} from "./model";

import {
  col as SequelizeCol,
  fn as SequelizeFn,
  Model,
  ModelCtor,
  Op as SequelizeOp,
  Transaction,
  WhereOptions
} from "sequelize";

import { ParseOption, parseOptions, ParseOptionsError } from "@miqro/core";

export class ModelService<T = any, T2 = any> extends AbstractModelService<T, T2> {
  protected getQueryParseOptions: ParseOption[];

  constructor(protected model: ModelCtor<Model<T, T2>>, protected options?: ModelServiceOptions) {
    super();

    this.getQueryParseOptions = [];
    if (!options) {
      this.getQueryParseOptions = this.getQueryParseOptions.concat(PAGINATION_OPTIONS());
    } else {
      this.getQueryParseOptions = this.getQueryParseOptions.concat(PAGINATION_OPTIONS(options.paginationOptions));
      if (options.orderColumnsValues) {
        this.getQueryParseOptions = this.getQueryParseOptions.concat(ORDER_OPTIONS(options.orderColumnsValues));
      }
      if (options.attributeValues) {
        this.getQueryParseOptions = this.getQueryParseOptions.concat(ATTRIBUTE_OPTIONS(options.attributeValues));
      }
      if (options.groupColumnsValues) {
        this.getQueryParseOptions = this.getQueryParseOptions.concat(GROUP_OPTIONS(options.groupColumnsValues));
      }
      if (options.searchColumnsValues) {
        this.getQueryParseOptions = this.getQueryParseOptions.concat(SEARCH_OPTIONS(options.searchColumnsValues));
      }
    }
  }

  public async get({ body, query, params }: ModelServiceArgs, transaction?: Transaction, skipLocked?: boolean): Promise<ModelServiceGetResult<T, T2>> {
    parseOptions("body", body, [], "no_extra");
    const { limit, offset, columns, q, order, attributes, group } = parseOptions("query", query, this.getQueryParseOptions, "no_extra", true);
    if (offset !== undefined && limit === undefined) {
      throw new ParseOptionsError(`query.limit needed for query.offset`);
    }

    if (offset === undefined && limit !== undefined) {
      throw new ParseOptionsError(`query.offset needed for query.limit`);
    }

    if (columns === undefined && q !== undefined) {
      throw new ParseOptionsError(`query.column needed for query.q`);
    }

    if (attributes) {
      for (let i = 0; i < (attributes as string[]).length; i++) {
        const att = (attributes as string[])[i];
        const fn = att.split(",").map(s => s.trim());
        if (fn.length > 1) {
          // att is a SequelizeFN not a column string
          if (fn.length !== 3) {
            throw new ParseOptionsError(`query.attributes [${att}] not valid!`);
          }
          const [fnName, col, name] = fn;
          parseOptions(`query.attributes`, { fn: fnName, col, name }, [
            { name: "fn", type: "enum", enumValues: ["sum"], required: true },
            { name: "col", type: "string", required: true },
            { name: "name", type: "string", required: true }
          ], "no_extra");

          try {
            (attributes as any[])[i] = [SequelizeFn(fnName, SequelizeCol(col as string)), name as string];
          } catch (e) {
            throw new ParseOptionsError(`bad query.attribute [${attributes}]`);
          }
        }
      }
    }
    if (order) {
      for (let i = 0; i < (order as string[]).length; i++) {
        (order as any)[i] = (order as string[])[i].split(",").map(s => s.trim());
        const orderI = (order as any)[i];
        if (!(orderI instanceof Array) || orderI.length !== 2 || (orderI[1] !== "DESC" && orderI[1] !== "ASC") || typeof orderI[0] !== "string") {
          throw new ParseOptionsError(`query.order not array of [column, "DESC"|"ASC"]`);
        }
      }
    }
    if (q !== undefined && columns !== undefined && q !== "") {
      const searchParams: any = {};
      for (const c of (columns as string[])) {
        searchParams[c] = {
          [SequelizeOp.or]: {
            [SequelizeOp.like]: "%" + q + "%",
            //[SequelizeOp.eq]: q
          }
        };
      }
      params = {
        [SequelizeOp.and]: params,
        [SequelizeOp.or]: searchParams
      } as any;
    }

    return transaction ? this.model.findAndCountAll({
      attributes: attributes as any,
      where: params as any,
      order: order as any,
      include: this.options && this.options.include ? this.options.include : undefined,
      limit: limit as number,
      distinct: true,
      offset: offset as number,
      group: group as string[],
      transaction,
      lock: true,
      skipLocked
    }) : this.model.findAndCountAll({
      attributes: attributes as any,
      where: params as any,
      order: order as any,
      distinct: true,
      include: this.options && this.options.include ? this.options.include : undefined,
      limit: limit as number,
      offset: offset as number,
      group: group as string[],
    })
  }

  public async post({ body, query, params }: ModelServiceArgs, transaction?: Transaction): Promise<ModelServicePostResult<T, T2>> {
    parseOptions("params", params, [], "no_extra");
    parseOptions("query", query, [], "no_extra");
    if (body instanceof Array) {
      return this.model.bulkCreate(body, transaction ? { transaction } : undefined);
    } else {
      return this.model.create(body as any, transaction ? { transaction } : undefined);
    }
  }

  public async patch({ body, query, params }: ModelServiceArgs, transaction?: Transaction): Promise<ModelServicePatchResult<T, T2>> {
    parseOptions("query", query, [], "no_extra");
    const patch = parseOptions("body", body, [], "add_extra");
    if (
      typeof patch !== "object" ||
      (patch as any) instanceof Array) {
      throw new ParseOptionsError(`patch not object`);
    }
    const [count, rows] = await this.model.update(body as unknown as Partial<T>, {
      where: params as WhereOptions,
      transaction
    });
    return { count, rows };
  }

  public async delete({ body, query, params }: ModelServiceArgs, transaction?: Transaction): Promise<ModelServiceDeleteResult | ModelServicePatchResult<T, T2>> {
    parseOptions("query", query, [], "no_extra");
    parseOptions("body", body, [], "no_extra");
    const count = await this.model.destroy({
      where: params as WhereOptions,
      transaction
    });
    return { count };
  }
}
