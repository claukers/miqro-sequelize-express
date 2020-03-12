import { describe, it } from "mocha";
import { expect } from "chai";
import { Util } from "@miqro/core";
import * as express from "express";
import { APIResponse } from "@miqro/handlers";
import * as sinon from "sinon";
import * as request from "supertest";
import * as path from "path";

process.env.MIQRO_DIRNAME = path.resolve(__dirname, "sample");
Util.loadConfig();

describe("ModelRouter functional tests", () => {
  it("ModelRouter get by id happy path with custom Router", (done) => {
    const { ModelRouter } = require("../src/");

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
    app.use("/user", [ModelRouter(modelService, express.Router()), finalHandler]);

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
  it("ModelRouter get by id happy path", (done) => {
    const { ModelRouter } = require("../src/");

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
    app.use("/user", [ModelRouter(modelService), finalHandler]);

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
  it("ModelRouter patch without id should 404", (done) => {
    const { ModelRouter } = require("../src/");

    const fakeId = "FakeId";
    const fakeInstance = "FakeInstance";

    const app = express();
    const modelService = {
      get: sinon.fake(async (args) => {

      }),
      post: sinon.fake(async (args) => {

      }),
      patch: sinon.fake(async (args) => {
        expect(args.params.id).to.be.equals(fakeId);
        return fakeInstance;
      }),
      delete: sinon.fake(async (args) => {

      })
    };
    const logger = {
      debug: (text) => {
        console.log(text);
      }
    }
    app.use("/user", [ModelRouter(modelService)]);

    request(app)
      .patch('/user')
      // .expect('Content-Type', /json/)
      // .expect('Content-Length', '40')
      .expect(404)
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          // expect(res.body.success).to.be.equals(true);
          // expect(res.body.result).to.be.equals(fakeInstance);
          expect(modelService.get.callCount).to.be.equals(0);
          expect(modelService.post.callCount).to.be.equals(0);
          expect(modelService.patch.callCount).to.be.equals(0);
          expect(modelService.delete.callCount).to.be.equals(0);
          done();
        }
      });
  });
});
