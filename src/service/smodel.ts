import {AbstractModelService} from "./amodel";
import {
  attributesParseOption,
  groupParseOption,
  ModelServiceDeleteResult,
  ModelServiceGetResult,
  ModelServicePatchResult,
  ModelServicePostResult,
  ModelServiceArgs,
  ModelServiceOptions,
  orderParseOption,
  paginationParseOption,
  searchParseOption
} from "./model";

import {
  Model,
  ModelCtor,
  WhereOptions,
  col as SequelizeCol,
  fn as SequelizeFn,
  Op as SequelizeOp,
  Transaction
} from "sequelize";

import {ParseOption, parseOptions, ParseOptionsError} from "@miqro/core";

const fixQueryArrays = (query: any, queryArgs: any): void => {
  const arrayNames = queryArgs.filter((q:any) => q.type === "array").map((q:any) => q.name);
  for (const arrayName of arrayNames) {
    if (query[arrayName] !== undefined && typeof query[arrayName] === "string") {
      query[arrayName] = [query[arrayName]] as any;
    }
  }
}

export class ModelService<T = any> extends AbstractModelService<T> {
  protected getQueryParseOptions: ParseOption[];

  constructor(protected model: ModelCtor<Model<T>>, protected options?: ModelServiceOptions) {
    super();

    this.getQueryParseOptions = [];
    if (!options) {
      this.getQueryParseOptions = this.getQueryParseOptions.concat(paginationParseOption);
      this.getQueryParseOptions.push(orderParseOption);
      this.getQueryParseOptions.push(attributesParseOption);
      this.getQueryParseOptions.push(groupParseOption);
      this.getQueryParseOptions = this.getQueryParseOptions.concat(searchParseOption);
    } else {
      if (!options.disableOrderQuery) {
        this.getQueryParseOptions.push(orderParseOption);
      }
      if (!options.disablePaginationQuery) {
        this.getQueryParseOptions = this.getQueryParseOptions.concat(paginationParseOption);
      }
      if (!options.disableAttributesQuery) {
        this.getQueryParseOptions.push(attributesParseOption);
      }
      if (!options.disableGroupQuery) {
        this.getQueryParseOptions.push(groupParseOption);
      }
      if (!options.disableSearchQuery) {
        this.getQueryParseOptions = this.getQueryParseOptions.concat(searchParseOption);
      }
    }
  }

  public async get({body, query, params}: ModelServiceArgs, transaction?: Transaction, skipLocked?: boolean): Promise<ModelServiceGetResult<T>> {
    parseOptions("body", body, [], "no_extra");
    fixQueryArrays(query, this.getQueryParseOptions);
    const {limit, offset, columns, q, order, attributes, group} = parseOptions("query", query, this.getQueryParseOptions, "no_extra");
    if (offset !== undefined && limit === undefined) {
      throw new ParseOptionsError(`query.limit needed for query.offset`);
    }

    if (offset === undefined && limit !== undefined) {
      throw new ParseOptionsError(`query.offset needed for query.limit`);
    }

    if (columns === undefined && q !== undefined) {
      throw new ParseOptionsError(`query.searchColumns needed for query.searchQuery`);
    }

    if (attributes) {
      for (let i = 0; i < (attributes as string[]).length; i++) {
        const attribute = (attributes as string[])[i];
        const fn = attribute.split(",").map(s => s.trim());
        if (fn.length > 1) {
          // attribute is a SequelizeFN not a column string
          if (fn.length !== 3) {
            throw new ParseOptionsError(`query.attributes [${attribute}] not valid!`);
          }
          const [fnName, col, name] = fn;
          parseOptions(`query.attributes`, {fn: fnName, col, name}, [
            {name: "fn", type: "enum", enumValues: ["sum"], required: true},
            {name: "col", type: "string", required: true},
            {name: "name", type: "string", required: true}
          ], "no_extra");

          try {
            (attributes as any[])[i] = [SequelizeFn(fnName, SequelizeCol(col as string)), name as string];
          } catch (e) {
            throw new ParseOptionsError(`bad query.attributes [${attribute}]`);
          }
        }
      }
    }
    if (order) {
      for (let i = 0; i < (order as string[]).length; i++) {
        (order as any)[i] = (order as string[])[i].split(",").map(s => s.trim());
        const orderI = (order as string[][])[i];
        if (!(orderI instanceof Array) || orderI.length !== 2 || (orderI[1] !== "DESC" && orderI[1] !== "ASC") || typeof orderI[0] !== "string") {
          throw new ParseOptionsError(`query.order not array of [column, "DESC"|"ASC"]`);
        }
      }
    }
    if (q !== undefined && columns !== undefined) {
      const searchParams: any = {};
      for (const column of (columns as string[])) {
        searchParams[column] = {
          [SequelizeOp.like]: "%" + q + "%"
        };
      }
      params = {
        [SequelizeOp.and]: params,
        [SequelizeOp.or]: searchParams
      } as any;
    }

    return limit !== undefined && offset !== undefined ? (transaction ? this.model.findAndCountAll({
      attributes: attributes as any,
      where: params as any,
      order: order as any,
      include: this.options && this.options.include ? this.options.include : undefined,
      limit: limit as number,
      offset: offset as number,
      group: group as string[],
      transaction,
      lock: true,
      skipLocked
    }) : this.model.findAndCountAll({
      attributes: attributes as any,
      where: params as any,
      order: order as any,
      include: this.options && this.options.include ? this.options.include : undefined,
      limit: limit as number,
      offset: offset as number,
      group: group as string[],
    })) : (transaction ? this.model.findAll({
      attributes: attributes as any,
      where: params as WhereOptions,
      order: order as any,
      include: this.options && this.options.include ? this.options.include : undefined,
      group: group as string[],
      transaction,
      lock: true,
      skipLocked
    }) : this.model.findAll({
      attributes: attributes as any,
      where: params as any,
      group: group as string[],
      order: order as any,
      include: this.options && this.options.include ? this.options.include : undefined,
    }))
  }

  public async post({body, query, params}: ModelServiceArgs, transaction?: Transaction): Promise<ModelServicePostResult<T>> {
    parseOptions("params", params, [], "no_extra");
    parseOptions("query", query, [], "no_extra");
    if (body instanceof Array) {
      return this.model.bulkCreate(body, transaction ? {transaction} : undefined);
    } else {
      return this.model.create(body as any, transaction ? {transaction} : undefined);
    }
  }

  public async patch({body, query, params, session}: ModelServiceArgs, transaction?: Transaction): Promise<ModelServicePatchResult<T>> {
    parseOptions("query", query, [], "no_extra");
    const patch = parseOptions("body", body, [], "add_extra");
    if (
      typeof patch !== "object" ||
      (patch as any) instanceof Array) {
      throw new ParseOptionsError(`patch not object`);
    }
    const [rowCount] = await this.model.update(body as unknown as Partial<T>, {
      where: params as WhereOptions,
      transaction
    });
    return rowCount;
  }

  public async delete({body, query, params, session}: ModelServiceArgs, transaction?: Transaction): Promise<ModelServiceDeleteResult | ModelServicePatchResult<T>> {
    parseOptions("query", query, [], "no_extra");
    parseOptions("body", body, [], "no_extra");
    return this.model.destroy({
      where: params as WhereOptions,
      transaction
    });
  }
}
