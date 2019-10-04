import { describe, it } from "mocha";
import { expect } from "chai";
import * as express from "express";
import * as sinon from "sinon";
import * as request from "supertest";

describe("ModelRoute functional tests", () => {
  it("createModelHandler get all happy path", (done) => {
    const { createModelHandler } = require("../src/");

    const fakeToken = "FakeToken";
    const fakeInstance = "FakeInstance";
    process.env.TOKEN_HEADER = "TOKEN_HEADER";

    const app = express();
    const modelService = {
      get: sinon.fake(async (args) => {
        expect(args.params.id).to.be.equals(undefined);
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
      res.json(req.serviceResults[0]);
    });
    app.use("/user", [createModelHandler(modelService, logger), finalHandler]);

    request(app)
      .get('/user')
      .set({ 'TOKEN_HEADER': fakeToken })
      .expect('Content-Type', /json/)
      .expect('Content-Length', '14')
      .expect(200)
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          expect(res.body).to.be.equals(fakeInstance);
          expect(finalHandler.callCount).to.be.equals(1);
          expect(modelService.get.callCount).to.be.equals(1);
          expect(modelService.post.callCount).to.be.equals(0);
          expect(modelService.patch.callCount).to.be.equals(0);
          expect(modelService.delete.callCount).to.be.equals(0);
          done();
        }
      });
  });

  it("createModelHandler get by id happy path", (done) => {
    const { createModelHandler } = require("../src/");

    const fakeId = "FakeId";
    const fakeToken = "FakeToken";
    const fakeInstance = "FakeInstance";
    process.env.TOKEN_HEADER = "TOKEN_HEADER";

    const app = express();
    const modelService = {
      get: sinon.fake(async (args) => {
        expect(fakeId).to.be.equals(args.params.id);
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
      res.json(req.serviceResults[0]);
    });
    app.use("/user", [createModelHandler(modelService, logger), finalHandler]);

    request(app)
      .get('/user/' + fakeId)
      .expect('Content-Type', /json/)
      .expect('Content-Length', '14')
      .expect(200)
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          expect(res.body).to.be.equals(fakeInstance);
          expect(finalHandler.callCount).to.be.equals(1);
          expect(modelService.get.callCount).to.be.equals(1);
          expect(modelService.post.callCount).to.be.equals(0);
          expect(modelService.patch.callCount).to.be.equals(0);
          expect(modelService.delete.callCount).to.be.equals(0);
          done();
        }
      });
  });

  it("createModelHandler patch by id happy path", (done) => {
    const { createModelHandler } = require("../src/");

    const fakeId = "FakeId";
    const fakeToken = "FakeToken";
    const fakeInstance = "FakeInstance";
    process.env.TOKEN_HEADER = "TOKEN_HEADER";

    const app = express();
    const modelService = {
      get: sinon.fake(async (args) => {
        
      }),
      post: sinon.fake(async (args) => {

      }),
      patch: sinon.fake(async (args) => {
        expect(fakeId).to.be.equals(args.params.id);
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
    const finalHandler = sinon.fake((req, res) => {
      res.json(req.serviceResults[0]);
    });
    app.use("/user", [createModelHandler(modelService, logger), finalHandler]);

    request(app)
      .patch('/user/' + fakeId)
      .set({ 'TOKEN_HEADER': fakeToken })
      .expect('Content-Type', /json/)
      .expect('Content-Length', '14')
      .expect(200)
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          expect(finalHandler.callCount).to.be.equals(1);
          expect(res.body).to.be.equals(fakeInstance);
          expect(modelService.get.callCount).to.be.equals(0);
          expect(modelService.post.callCount).to.be.equals(0);
          expect(modelService.patch.callCount).to.be.equals(1);
          expect(modelService.delete.callCount).to.be.equals(0);
          done();
        }
      });
  });
});
