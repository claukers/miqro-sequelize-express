import { ErrorHandler, Handler, Context, getLogger, Logger } from "@miqro/core";
import { DataTypes, Model, ModelCtor, Sequelize, Transaction } from "sequelize";

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
};

const auditLog = async (auditModel: ModelCtor<Model<any>>, ctx: Context, e?: Error | string, originalRequest?: any, transaction?: Transaction): Promise<void> => {
  await auditModel.create({
    originalReq: originalRequest,
    headers: ctx ? ctx.headers : undefined,
    remoteAddress: ctx ? ctx.remoteAddress : undefined,
    body: ctx ? ctx.body : undefined,
    query: ctx ? ctx.query : undefined,
    params: undefined,
    results: ctx ? ctx.results : undefined,
    session: ctx ? ctx.session : undefined,
    username: ctx && ctx.session ? ctx.session.username : undefined,
    groups: ctx && ctx.session ? ctx.session.groups : undefined,
    account: ctx && ctx.session ? ctx.session.account : undefined,
    url: ctx ? ctx.url : undefined,
    method: ctx ? ctx.method : undefined,
    uuid: ctx ? ctx.uuid : undefined,
    took: ctx ? (ctx as any).auditTook : undefined,
    status: ctx ? ctx.res.statusCode : undefined,
    resHeaders: ctx ? ctx.res.getHeaders() : undefined,
    error: e ? {
      name: typeof e !== "string" ? e.name : undefined,
      message: typeof e !== "string" ? e.message : e,
      stack: typeof e !== "string" ? e.stack : undefined,
    } : undefined
  }, transaction ? { transaction } : undefined);
};

export const AuditHandler = (auditModelName = "audit", sequelize: Sequelize, logger?: Logger): Handler => {
  logger = logger ? logger : getLogger("AuditHandler");
  const auditModel = AuditModel(auditModelName, sequelize);
  auditModel.sync({
    force: false
  }).catch((e) => {
    (logger as Logger).error(e);
  });
  return async (ctx: Context): Promise<true> => {
    const originalReq = {
      headers: {
        ...ctx.headers
      },
      remoteAddress: ctx.remoteAddress,
      body: typeof ctx.body === "object" ? {
        ...ctx.body
      } : ctx.body,
      query: {
        ...ctx.query
      },
      params: {
      },
      results: ([] as any).concat(ctx.results),
      session: {
        ...ctx.session
      },
      url: ctx.url,
      method: ctx.method,
      uuid: ctx.uuid
    };
    ctx.res.on("close", async () => {
      try {
        (ctx as any).auditTook = Date.now() - ctx.startMS;
        await auditLog(auditModel, ctx, (ctx as any).audit_error, originalReq);
      } catch (e) {
        (logger as Logger).error(e);
      }
    });
    return true;
  };
}

export const AuditErrorHandler = (): ErrorHandler => {
  return async (e: Error, ctx: Context): Promise<void> => {
    (ctx as any).audit_error = e;
  };
}

