import {getLogger, Logger, StopWatch} from "@miqro/core";
import {CatchHandler, ErrorCallback, NextCallback} from "@miqro/handlers";
import {Request, Response} from "express";
import {DataTypes, Model, ModelCtor, Sequelize, Transaction} from "sequelize";

const AuditModel = (auditModelName: string, sequelize: Sequelize): ModelCtor<Model<any>> => {
  return sequelize.define(auditModelName, {
    originalReq: DataTypes.JSON,
    headers: DataTypes.JSON,
    body: DataTypes.JSON,
    query: DataTypes.JSON,
    params: DataTypes.JSON,
    remoteAddress: DataTypes.STRING,
    results: DataTypes.JSON,
    took: DataTypes.INTEGER,
    session: DataTypes.JSON,
    username: DataTypes.STRING,
    account: DataTypes.STRING,
    groups: DataTypes.JSON,
    url: DataTypes.STRING(3000),
    method: DataTypes.STRING,
    status: DataTypes.STRING,
    resHeaders: DataTypes.JSON,
    error: DataTypes.JSON,
    uuid: DataTypes.STRING
  }, {});
}

const auditLog = async (auditModel: ModelCtor<Model<any>>, req: Request, res?: Response, e?: Error | string, originalRequest?: any, transaction?: Transaction): Promise<void> => {
  await auditModel.create({
    originalReq: originalRequest,
    headers: req ? req.headers : undefined,
    remoteAddress: req ? req.connection.remoteAddress : undefined,
    body: req ? req.body : undefined,
    query: req ? req.query : undefined,
    params: req ? req.params : undefined,
    results: req ? req.results : undefined,
    session: req ? req.session : undefined,
    username: req && req.session ? req.session.username : undefined,
    groups: req && req.session ? req.session.groups : undefined,
    account: req && req.session ? req.session.account : undefined,
    url: req ? req.url : undefined,
    method: req ? req.method : undefined,
    uuid: req ? req.uuid : undefined,
    took: res ? (res as any).took : undefined,
    status: res ? res.statusCode : undefined,
    resHeaders: res ? res.getHeaders() : undefined,
    error: e ? {
      name: typeof e !== "string" ? e.name : undefined,
      message: typeof e !== "string" ? e.message : e,
      stack: typeof e !== "string" ? e.stack : undefined,
    } : undefined
  }, transaction ? {transaction} : undefined);
};

export const AuditHandler = (auditModelName = "audit", sequelize: Sequelize, logger?: Logger): NextCallback => {
  logger = logger ? logger : getLogger("AuditHandler");
  const auditModel = AuditModel(auditModelName, sequelize);
  auditModel.sync({
    force: false
  }).catch((e) => {
    (logger as Logger).error(e);
  });
  return CatchHandler(async (req, res, next) => {
    const originalReq = {
      headers: {
        ...req.headers
      },
      remoteAddress: req.connection.remoteAddress,
      body: typeof req.body === "object" ? {
        ...req.body
      } : req.body,
      query: {
        ...req.query
      },
      params: {
        ...req.params
      },
      results: ([] as any).concat(req.results),
      session: {
        ...req.session
      },
      url: req.url,
      method: req.method,
      uuid: req.uuid
    };
    const clock = new StopWatch();
    res.on("finish", async () => {
      (res as any).took = clock.stop();
      try {
        await auditLog(auditModel, req, res, (req as any).audit_error, originalReq);
      } catch (e) {
        (logger as Logger).error(e);
      }
    });
    next();
  }, logger);
}

export const AuditErrorHandler = (logger: Logger): ErrorCallback =>
  async (e, req, res, next) => {
    (req as any).audit_error = e;
    next(e);
  };
