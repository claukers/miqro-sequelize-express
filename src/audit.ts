import { Database, getLogger, Logger, StopWatch } from "@miqro/core";
import { CatchHandler, ErrorCallback, NextCallback } from "@miqro/handlers";
import { Request, Response } from "express";
import {ModelDAO} from "./service";

const AuditModel = (auditModelName: string, sequelize: any, DataTypes: any) => {
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
    url: DataTypes.STRING,
    method: DataTypes.STRING,
    status: DataTypes.STRING,
    resHeaders: DataTypes.STRING,
    error: DataTypes.JSON,
    uuid: DataTypes.STRING
  }, {});
}

const auditLog = async (auditModel: ModelDAO, req: Request, res?: Response, e?: Error | string, originalRequest?: any, transaction?: any): Promise<void> => {
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
    resHeaders: res ? JSON.stringify(res.getHeaders()) : undefined,
    error: e ? {
      name: typeof e !== "string" ? e.name : undefined,
      message: typeof e !== "string" ? e.message : e,
      stack: typeof e !== "string" ? e.stack : undefined,
    } : undefined
  }, transaction ? { transaction } : undefined);
};

export const AuditHandler = (auditModelName = "audit", db = Database.getInstance(), logger?: Logger): NextCallback => {
  logger = logger ? logger : getLogger("AuditHandler");
  const auditModel = AuditModel(auditModelName, db.sequelize, db.Sequelize.DataTypes);
  db.models[auditModelName] = auditModel;
  return CatchHandler(async (req, res, next) => {
    await db.models[auditModelName].sync({
      force: false
    });
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
        await auditLog(db.models[auditModelName], req, res, (req as any).audit_error, originalReq);
      } catch (e) {
        (logger as Logger).error(e);
      }
    });
    next();
  }, logger as any);
}

export const AuditErrorHandler = (logger: Logger): ErrorCallback =>
  async (e, req, res, next) => {
    (req as any).audit_error = e;
    next(e);
  };
