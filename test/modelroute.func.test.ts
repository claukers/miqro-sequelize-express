import { describe, it } from "mocha";
import { expect } from "chai";
import { Util } from "miqro-core";
import * as express from "express";
import { APIResponse } from "miqro-express";
import * as sinon from "sinon";
import * as request from "supertest";
import * as path from "path";

process.env.MIQRO_DIRNAME = path.resolve(__dirname, "sample");
Util.loadConfig();

describe("ModelRoute functional tests", () => {
  it("ModelRoute get by id happy path", (done) => {
    const { ModelRoute } = require("../src/");

    const fakeId = "FakeId";
    const fakeInstance = "FakeInstance";

    const app = express();
    const modelService = {
      get: sinon.fake(async (args) => {
        expect(args.params.id).to.be.equals(fakeId);
        return fakeInstance;
      }),
      post: sinon.fake(async (args) => {

      }),
      patch: sinon.fake(async (args) => {

      }),
      delete: sinon.fake(async (args) => {

      })
    };
    const logger = {
      debug: (text) => {
        console.log(text);
      }
    }
    const finalHandler = sinon.fake((req, res) => {
    });
    app.use("/user", [new ModelRoute(modelService).routes(), finalHandler]);

    request(app)
      .get('/user/' + fakeId)
      // .expect('Content-Type', /json/)
      // .expect('Content-Length', '40')
      // .expect(200)
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          // expect(res.body.success).to.be.equals(true);
          // expect(res.body.result).to.be.equals(fakeInstance);
          expect(finalHandler.callCount).to.be.equals(0);
          expect(modelService.get.callCount).to.be.equals(1);
          expect(modelService.post.callCount).to.be.equals(0);
          expect(modelService.patch.callCount).to.be.equals(0);
          expect(modelService.delete.callCount).to.be.equals(0);
          done();
        }
      });
  });
  it("ModelRoute get by id happy path from preRoute", (done) => {
    const { ModelRoute } = require("../src/");

    const fakeId = "FakeId";
    const fakeInstance = "FakeInstance";

    const app = express();
    const modelService = {
      get: sinon.fake(async (args) => {
        expect(args.params.id).to.be.equals(fakeId);
        return fakeInstance;
      }),
      post: sinon.fake(async (args) => {

      }),
      patch: sinon.fake(async (args) => {

      }),
      delete: sinon.fake(async (args) => {

      })
    };
    const logger = {
      debug: (text) => {
        console.log(text);
      }
    }
    const finalHandler = sinon.fake((req, res) => {
    });
    app.use("/user", new ModelRoute(modelService, {
      preRoute: "/:userId/groups"
    }).routes());

    request(app)
      .get('/user/1/groups/' + fakeId)
      .expect('Content-Type', /json/)
      .expect('Content-Length', '40')
      .expect(200)
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          expect(res.body.success).to.be.equals(true);
          expect(res.body.result).to.be.equals(fakeInstance);
          expect(finalHandler.callCount).to.be.equals(0);
          expect(modelService.get.callCount).to.be.equals(1);
          expect(modelService.post.callCount).to.be.equals(0);
          expect(modelService.patch.callCount).to.be.equals(0);
          expect(modelService.delete.callCount).to.be.equals(0);
          done();
        }
      });
  });
  it("ModelRoute get by id happy path from preRoute 404", (done) => {
    const { ModelRoute } = require("../src/");

    const fakeId = "FakeId";
    const fakeInstance = "FakeInstance";

    const app = express();
    const modelService = {
      get: sinon.fake(async (args) => {
        expect(args.params.id).to.be.equals(fakeId);
        return fakeInstance;
      }),
      post: sinon.fake(async (args) => {

      }),
      patch: sinon.fake(async (args) => {

      }),
      delete: sinon.fake(async (args) => {

      })
    };
    const logger = {
      debug: (text) => {
        console.log(text);
      }
    }
    const finalHandler = sinon.fake((req, res) => {
    });
    app.use("/user", new ModelRoute(modelService, {
      name: "user router",
      preRoute: "/:userId/blu"
    }).routes());

    request(app)
      .get('/user/1/groups/' + fakeId)
      .expect('Content-Type', /text\/html/)
      .expect('Content-Length', '159')
      .expect(404)
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          expect(res.body.success).to.be.equals(undefined);
          expect(finalHandler.callCount).to.be.equals(0);
          expect(modelService.get.callCount).to.be.equals(0);
          expect(modelService.post.callCount).to.be.equals(0);
          expect(modelService.patch.callCount).to.be.equals(0);
          expect(modelService.delete.callCount).to.be.equals(0);
          done();
        }
      });
  });
  it("ModelRoute get by id custom errorResponse", (done) => {
    const { ModelRoute } = require("../src/");

    const fakeId = "FakeId";

    const app = express();
    const modelService = {
      get: sinon.fake(async (args) => {
        throw new Error("bli");
      }),
      post: sinon.fake(async (args) => {

      }),
      patch: sinon.fake(async (args) => {

      }),
      delete: sinon.fake(async (args) => {

      })
    };
    const logger = {
      debug: (text) => {
        console.log(text);
      }
    }
    const finalHandler = sinon.fake((req, res) => {
    });
    app.use("/user", new ModelRoute(modelService, {
      name: "user router",
      preRoute: "/:userId/groups",
      errorResponse: async (e: Error, req: Request) => {
        return new class extends APIResponse {
          constructor(body?) {
            super(body);
            this.status = 555;
            this.body = { "b": "c" };
          }
        }
      }
    }).routes());

    request(app)
      .get('/user/1/groups/' + fakeId)
      .expect('Content-Type', /json/)
      .expect('Content-Length', '9')
      .expect(555)
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          expect(res.body.b).to.be.equals("c");
          expect(finalHandler.callCount).to.be.equals(0);
          expect(modelService.get.callCount).to.be.equals(1);
          expect(modelService.post.callCount).to.be.equals(0);
          expect(modelService.patch.callCount).to.be.equals(0);
          expect(modelService.delete.callCount).to.be.equals(0);
          done();
        }
      });
  });
});
