import {Util} from "@miqro/core";
import {strictEqual} from "assert";
import {describe, it} from "mocha";
import {resolve} from "path";
import {FakeDeleteModelService, loadModels, MapModelHandler, ModelService} from "../src";

process.env.NODE_ENV = "test";
process.env.MIQRO_DIRNAME = resolve(__dirname, "data");
process.chdir(process.env.MIQRO_DIRNAME);
Util.loadConfig();

const models = loadModels();

describe("ModelService Func Tests", function () {
  this.timeout(100000);
  it("case 1 get with pagination and order  but no params 1 with getDB", (done) => {
    (async () => {
      const service = new ModelService(models.post);
      const result = await service.get({
        params: {},
        query: {
          limit: 2,
          offset: 1,
          order: [" createdAt , DESC"]
        },
        body: {}
      });
      if (!(result instanceof Array)) {
        strictEqual(result.count, 4);
        strictEqual(result.rows.length, 2);
      } else {
        strictEqual(true, false);
      }

    })().then(done).catch(done);
  });

  it("case 1 get sum group by name with pagination using fixqueryarrays", (done) => {
    (async () => {
      const service = new ModelService(models.post);
      const result = await service.get({
        params: {},
        query: {
          attributes: ["name", "sum,amount,total"],
          group: "name",
          limit: 10,
          offset: 1,
          order: "name, DESC"
        },
        body: {}
      });
      if (!(result instanceof Array)) {
        if (result.count instanceof Array) {
          strictEqual(result.count.length, 3);
          strictEqual(result.rows.length, 2);
          strictEqual((result.rows[0] as any).dataValues.total, 60);
          strictEqual((result.rows[1] as any).dataValues.total, 10);
        } else {
          strictEqual(true, false);
        }
      } else {
        strictEqual(true, false);
      }

    })().then(done).catch(done);
  });

  it("case 1 get sum group by name", (done) => {
    (async () => {
      const service = new ModelService(models.post);
      const result = await service.get({
        params: {},
        query: {
          attributes: ["name", "sum,amount,total"],
          group: ["name"],
          order: ["name, DESC"]
        },
        body: {}
      });
      if (!(result instanceof Array)) {
        strictEqual((result.count as any[]).length, 3);
        strictEqual((result.rows[0] as any).dataValues.total, 30);
        strictEqual((result.rows[1] as any).dataValues.total, 60);
        strictEqual((result.rows[2] as any).dataValues.total, 10);
      } else {
        strictEqual(true, false);
      }

    })().then(done).catch(done);
  });

  it("case 1 get sum", (done) => {
    (async () => {
      const service = new ModelService(models.post);
      const result = await service.get({
        params: {},
        query: {
          attributes: ["name", "sum,amount,total"]
        },
        body: {}
      });
      if (!(result instanceof Array)) {
        strictEqual(result.count, 4);
        strictEqual(result.rows.length, 1);
        strictEqual((result.rows[0] as any).dataValues.total, 100);
      } else {
        strictEqual(true, false);
      }

    })().then(done).catch(done);
  });


  it("deleted happy path", (done) => {
    (async () => {
      const service = new FakeDeleteModelService(models.post2);
      const result = await service.get({
        params: {},
        query: {
          limit: 2,
          offset: 0,
          order: ["createdAt, DESC"]
        },
        body: {}
      });
      if (!(result instanceof Array)) {
        strictEqual(result.count, 1);
        strictEqual(result.rows.length, 1);
      } else {
        strictEqual(true, false);
      }

    })().then(done).catch(done);
  });

  it("case 1 get with pagination and order  but no params 1", (done) => {
    (async () => {
      const service = new ModelService(models.post);
      const result = await service.get({
        params: {},
        query: {
          limit: "2",
          offset: "1",
          order: ["createdAt, DESC"]
        },
        body: {}
      });
      if (!(result instanceof Array)) {
        strictEqual(result.count, 4);
        strictEqual(result.rows.length, 2);
      } else {
        strictEqual(true, false);
      }

    })().then(done).catch(done);
  });

  it("case 2 get with pagination and order and params 1", (done) => {
    (async () => {
      const service = new ModelService(models.post);
      const result = await service.get({
        params: {
          name: "user2"
        },
        query: {
          limit: 10,
          offset: 0,
          order: ["createdAt, DESC"]
        },
        body: {}
      });
      if (!(result instanceof Array)) {
        strictEqual(result.count, 2);
        strictEqual(result.rows.length, 2);
      } else {
        strictEqual(true, false);
      }
    })().then(done).catch(done);
  });

  it("case 2 get with pagination and order and params 1 and search query", (done) => {
    (async () => {
      const service = new ModelService(models.post);
      const result = await service.get({
        params: {
          name: "user2"
        },
        query: {
          limit: 10,
          offset: 0,
          q: "email3",
          columns: ["email", "name"],
          order: ["createdAt, DESC"]
        },
        body: {}
      });
      if (!(result instanceof Array)) {
        strictEqual(result.count, 1);
        strictEqual(result.rows.length, 1);
      } else {
        strictEqual(true, false);
      }
    })().then(done).catch(done);
  });

  it("case 2 get with pagination and order and params 1 and search query as number", (done) => {
    (async () => {
      const service = new ModelService(models.post);
      const result = await service.get({
        params: {
          name: "user2"
        },
        query: {
          limit: 10,
          offset: 0,
          q: "20",
          columns: ["amount"],
          order: ["createdAt, DESC"]
        },
        body: {}
      });
      if (!(result instanceof Array)) {
        strictEqual(result.count, 1);
        strictEqual(result.rows.length, 1);
      } else {
        strictEqual(true, false);
      }
    })().then(done).catch(done);
  });

  it("case 2 get with pagination and order and params 2", (done) => {
    (async () => {
      const service = new ModelService(models.post);
      const result = await service.get({
        params: {
          email: "email1"
        },
        query: {
          limit: 10,
          offset: 0,
          order: ["createdAt, DESC"]
        },
        body: {}
      });
      if (!(result instanceof Array)) {
        strictEqual(result.count, 2);
        strictEqual(result.rows.length, 2);
      } else {
        strictEqual(true, false);
      }
    })().then(done).catch(done);
  });

  it("case 2 get with pagination and order and params 2 and mapping", (done) => {
    (async () => {
      const service = new ModelService(models.post);
      const req: any = {results: []};
      const result = await service.get({
        params: {
          email: "email1"
        },
        query: {
          limit: 10,
          offset: 0,
          order: ["createdAt, DESC"]
        },
        body: {}
      });
      req.results.push(result);
      MapModelHandler(({email}) => {
        return {email};
      })(req as any, {} as any, (e: any) => {
        strictEqual(e, undefined);
        if (!(req.results[0] instanceof Array)) {
          strictEqual(req.results[0].count, 2);
          strictEqual(req.results[0].rows.length, 2);
          strictEqual(Object.keys(req.results[0].rows[0]).length, 1);
        } else {
          strictEqual(true, false);
        }
      });
    })().then(done).catch(done);
  });

  it("map throws", (done) => {
    const req: any = {results: [{a: 1}]};
    MapModelHandler(() => {
      throw new Error("asd");
    })(req as any, {} as any, (e: any) => {
      strictEqual(e.message, "asd");
      done();
    });
  });

  it("case 2 get with pagination and order and params 1 and search query with column limit", (done) => {
    (async () => {
      const service = new ModelService(models.post, {
        searchColumns: ["name"]
      });
      try {
        await service.get({
          params: {
            name: "user2"
          },
          query: {
            limit: 10,
            offset: 0,
            q: "email3",
            columns: ["email", "name"],
            order: ["createdAt, DESC"]
          },
          body: {}
        });
      } catch (e) {
        strictEqual(e.message, "query.columns not array1: of enum as defined. valid values [name]");
      }
    })().then(done).catch(done);
  });

  it("case 2 get with pagination and order and params 1 and search query with column limit happy path", (done) => {
    (async () => {
      const service = new ModelService(models.post, {
        searchColumns: ["email"]
      });

      const result = await service.get({
        params: {
          name: "user2"
        },
        query: {
          limit: 10,
          offset: 0,
          q: "email3",
          columns: ["email"],
          order: ["createdAt, DESC"]
        },
        body: {}
      });
      if (!(result instanceof Array)) {
        strictEqual(result.count, 1);
        strictEqual(result.rows.length, 1);
      } else {
        strictEqual(true, false);
      }
    })().then(done).catch(done);
  });
});
