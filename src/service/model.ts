import { ParseOptionsError, Util } from "miqro-core";
import { IServiceArgs } from "miqro-express";
import { Database } from "miqro-sequelize";
import * as Sequelize from "sequelize";
import { AbstractModelService } from "./common";

let logger = null;

const parseIncludeQuery = (includeQuery: any[]): any[] => {
  const ret = [];
  for (const includeModel of includeQuery) {
    if (typeof includeModel === "string") {
      const model = Database.getInstance().models[includeModel];
      if (model) {
        ret.push(model);
      } else {
        throw new ParseOptionsError(`query.include[${includeModel}] model doesnt exists!`);
      }
    } else if (typeof includeModel === "object") {
      const includeO = Util.parseOptions("query.include[n]", includeModel, [
        { name: "model", type: "string", required: true },
        { name: "required", type: "boolean", required: true },
        { name: "where", type: "object", required: true },
        { name: "include", type: "array", arrayType: "any", required: false }
      ], "no_extra");
      const model = Database.getInstance().models[includeO.model];
      if (model) {
        if (includeO.include) {
          ret.push({
            model,
            required: includeO.required,
            where: includeO.where,
            include: parseIncludeQuery(includeO.include)
          });
        } else {
          ret.push({
            model,
            required: includeO.required,
            where: includeO.where
          });
        }
      } else {
        throw new ParseOptionsError(`query.include[${includeO.model}] model doesnt exists!`);
      }
    } else {
      throw new ParseOptionsError(`problem with your query.include!`);
    }
  }
  return ret;
};

export class ModelService extends AbstractModelService {
  constructor(protected model: any) {
    super();
    if (!logger) {
      logger = Util.getLogger("ModelService");
    }
  }
  public async get({ body, query, params, session }: IServiceArgs): Promise<any> {
    const { pagination, include } = Util.parseOptions("query", query, [
      { name: "include", type: "string", required: false },
      { name: "pagination", type: "string", required: false }
    ], "no_extra");
    let includeModels = [];
    if (include) {
      let includeList = [];
      try {
        includeList = JSON.parse(include);
      } catch (e) {
        throw new ParseOptionsError(`query.include not a valid JSON`);
      }
      includeModels = parseIncludeQuery(includeList);
    }
    let paginationJSON;
    if (pagination) {
      try {
        paginationJSON = JSON.parse(pagination);
      } catch (e) {
        throw new ParseOptionsError(`query.pagination not a valid JSON`);
      }
      Util.parseOptions("query.pagination", paginationJSON, [
        { name: "limit", type: "number", required: true },
        { name: "search", type: "object", required: false },
        { name: "offset", type: "number", required: true }
      ], "no_extra");
      if (paginationJSON.search) {
        Util.parseOptions("query.pagination.search", paginationJSON.search, [
          { name: "columns", type: "array", arrayType: "string", required: true },
          { name: "query", type: "string", required: true }
        ], "no_extra");
      }
    }
    Util.parseOptions("body", body, [], "no_extra");
    let ret;
    if (Object.keys(params).length > 0) {
      if (pagination) {
        if (paginationJSON.search) {
          if (paginationJSON.search.columns.length > 0) {
            const searchParams = {};
            for (const column of paginationJSON.search.columns) {
              searchParams[column] = {
                [Sequelize.Op.like]: "%" + paginationJSON.search.query + "%"
              };
            }
            params = {
              [Sequelize.Op.and]: params,
              [Sequelize.Op.or]: searchParams
            };
          }
        }
        ret = await this.model.findAndCountAll({
          where: params,
          include: includeModels,
          limit: paginationJSON.limit,
          offset: paginationJSON.offset
        });
      } else {
        ret = await this.model.findAll({
          where: params,
          include: includeModels
        });
      }
    } else {
      if (pagination) {
        let params2 = null;
        if (paginationJSON.search) {
          if (paginationJSON.search.columns.length > 0) {
            const searchParams = {};
            for (const column of paginationJSON.search.columns) {
              searchParams[column] = {
                [Sequelize.Op.like]: "%" + paginationJSON.search.query + "%"
              };
            }
            params2 = {
              [Sequelize.Op.or]: searchParams
            };
          }
        }
        if (params2) {
          ret = await this.model.findAndCountAll({
            where: params,
            include: includeModels,
            limit: paginationJSON.limit,
            offset: paginationJSON.offset
          });
        } else {
          ret = await this.model.findAndCountAll({
            include: includeModels,
            limit: paginationJSON.limit,
            offset: paginationJSON.offset
          });
        }
      } else {
        ret = await this.model.findAll({
          include: includeModels
        });
      }
    }
    return ret;
  }
  public async post({ body, query, params, session }: IServiceArgs): Promise<any> {
    Util.parseOptions("params", params, [], "no_extra");
    Util.parseOptions("query", query, [], "no_extra");
    return this.model.create(body);
  }
  public async patch({ body, query, params, session }: IServiceArgs): Promise<any> {
    Util.parseOptions("query", query, [], "no_extra");
    const instances = await this.get({
      session,
      body: {},
      query,
      params,
      headers: {}
    });
    if (instances.length === 1) {
      return instances[0].update(body);
    } else {
      return null;
    }
  }
  public async delete({ body, query, params, session }: IServiceArgs): Promise<any> {
    Util.parseOptions("query", query, [], "no_extra");
    Util.parseOptions("body", body, [], "no_extra");
    const instances = await this.get({
      session,
      body: {},
      query,
      params,
      headers: {}
    });
    if (instances.length === 1) {
      return instances[0].destroy();
    } else {
      return null;
    }
  }
}
