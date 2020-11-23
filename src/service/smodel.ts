import {AbstractModelService} from "./amodel";
import {
  attributesParseOption,
  groupParseOption,
  ModelDAO,
  ModelDeleteResult,
  ModelGetResult,
  ModelPatchResult,
  ModelPostResult,
  ModelServiceArgs,
  ModelServiceOptions,
  orderParseOption,
  paginationParseOption,
  searchParseOption
} from "./model";

import {ParseOption, parseOptions, ParseOptionsError, Database} from "@miqro/core";

export class ModelService extends AbstractModelService {
  protected getQueryParseOptions: ParseOption[];

  /* eslint-disable  @typescript-eslint/explicit-module-boundary-types */
  constructor(protected model: ModelDAO, protected options?: ModelServiceOptions, protected db = Database.getInstance()) {
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

  public async get({body, query, params}: ModelServiceArgs, transaction?: any, skipLocked?: boolean): Promise<ModelGetResult> {
    parseOptions("body", body, [], "no_extra");
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
            (attributes as any[])[i] = [this.db.Sequelize.fn(fnName, this.db.Sequelize.col(col as string)), name as string];
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
          [this.db.Sequelize.Op.like]: "%" + q + "%"
        };
      }
      params = {
        [this.db.Sequelize.Op.and]: params,
        [this.db.Sequelize.Op.or]: searchParams
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
      where: params as any,
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

  public async post({body, query, params}: ModelServiceArgs, transaction?: any): Promise<ModelPostResult> {
    parseOptions("params", params, [], "no_extra");
    parseOptions("query", query, [], "no_extra");
    // noinspection JSDeprecatedSymbols
    return this.model.create(body as any, transaction ? {transaction} : undefined);
  }

  /* eslint-disable  @typescript-eslint/explicit-module-boundary-types */
  public async patch({body, query, params, session}: ModelServiceArgs, transaction?: any): Promise<ModelPatchResult> {
    parseOptions("query", query, [], "no_extra");
    const patch = parseOptions("body", body, [], "add_extra");
    if (
      typeof patch !== "object" ||
      (patch as any) instanceof Array) {
      throw new ParseOptionsError(`patch not object`);
    }
    const result = await this.get({
      body: {},
      query,
      session,
      params
    }, transaction);
    const instances = result instanceof Array ? result : result.rows;
    if (this.options && this.options.enableMultiInstancePatch && instances.length > 0) {
      const tR = [];
      for (const instance of instances) {
        tR.push(instance.update(body, transaction ? {transaction} : undefined));
      }
      return Promise.all(tR);
    } else if (instances.length === 1) {
      return instances[0].update(body, transaction ? {transaction} : undefined);
    } else {
      return null;
    }
  }

  public async delete({body, query, params, session}: ModelServiceArgs, transaction?: any): Promise<ModelDeleteResult | ModelPatchResult> {
    parseOptions("query", query, [], "no_extra");
    parseOptions("body", body, [], "no_extra");
    const result = await this.get({
      body: {},
      query,
      session,
      params
    }, transaction);
    const instances = result instanceof Array ? result : result.rows;
    if (this.options && this.options.enableMultiInstanceDelete && instances.length > 0) {
      const tR = [];
      for (const instance of instances) {
        tR.push(instance.destroy(transaction ? {transaction} : undefined));
      }
      return Promise.all(tR);
    } else if (instances.length === 1) {
      return instances[0].destroy(transaction ? {transaction} : undefined);
    } else {
      return null;
    }
  }
}
