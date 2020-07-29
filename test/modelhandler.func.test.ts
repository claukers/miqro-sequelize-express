import {describe, it} from "mocha";
import express from "express";
import {strictEqual} from "assert";
import {fake, FuncTestHelper} from "./func_test_helper";

describe("ModelHandler functional tests", () => {
  it("ModelHandler get all happy path", (done) => {
    const {ModelHandler} = require("../src/");

    const fakeToken = "FakeToken";
    const fakeInstance = "FakeInstance";
    process.env.TOKEN_HEADER = "TOKEN_HEADER";

    const app = express();
    const modelService = {
      get: fake(async (args) => {
        strictEqual(args.params.id, undefined);
        return fakeInstance;
      }),
      post: fake(async (args) => {

      }),
      patch: fake(async (args) => {

      }),
      delete: fake(async (args) => {

      })
    };
    const finalHandler = fake((req, res) => {
      res.json(req.results[0]);
    });
    app.use("/user", [ModelHandler(modelService), finalHandler]);

    FuncTestHelper({
      app,
      url: '/user',
      method: "get"
    }, ({status, data, headers}) => {
      strictEqual(status, 200);
      strictEqual(headers["content-type"], "application/json; charset=utf-8");
      //strictEqual(headers["content-length"], "14");
      strictEqual(data, fakeInstance);
      strictEqual(finalHandler.callCount, 1);
      strictEqual(modelService.get.callCount, 1);
      strictEqual(modelService.post.callCount, 0);
      strictEqual(modelService.patch.callCount, 0);
      strictEqual(modelService.delete.callCount, 0);
      done();
    });
  });

  it("ModelHandler get by id happy path", (done) => {
    const {ModelHandler} = require("../src/");

    const fakeId = "FakeId";
    const fakeToken = "FakeToken";
    const fakeInstance = "FakeInstance";
    process.env.TOKEN_HEADER = "TOKEN_HEADER";

    const app = express();
    const modelService = {
      get: fake(async (args) => {
        strictEqual(fakeId, args.params.id);
        return fakeInstance;
      }),
      post: fake(async (args) => {

      }),
      patch: fake(async (args) => {

      }),
      delete: fake(async (args) => {

      })
    };
    const logger = {
      debug: (text: string) => {
        console.log(text);
      }
    };
    const finalHandler = fake((req, res) => {
      res.json(req.results[0]);
    });
    app.use("/user/:id", [ModelHandler(modelService, logger), finalHandler]);

    FuncTestHelper({
      app,
      url: '/user/' + fakeId,
      method: "get"
    }, ({status, data, headers}) => {
      strictEqual(status, 200);
      strictEqual(headers["content-type"], "application/json; charset=utf-8");
      strictEqual(headers["content-length"], "14");
      strictEqual(data, fakeInstance);
      strictEqual(finalHandler.callCount, 1);
      strictEqual(modelService.get.callCount, 1);
      strictEqual(modelService.post.callCount, 0);
      strictEqual(modelService.patch.callCount, 0);
      strictEqual(modelService.delete.callCount, 0);
      done();
    });
  });

  /*it("ModelHandler patch by id happy path", (done) => {
    const {ModelHandler} = require("../src/");

    const fakeId = "FakeId";
    const fakeToken = "FakeToken";
    const fakeInstance = "FakeInstance";
    process.env.TOKEN_HEADER = "TOKEN_HEADER";

    const app = express();
    const modelService = {
      get: fake(async (args) => {

      }),
      post: fake(async (args) => {

      }),
      patch: fake(async (args) => {
        strictEqual(fakeId, args.params.id);
        return fakeInstance;
      }),
      delete: fake(async (args) => {

      })
    };
    const logger = {
      debug: (text) => {
        console.log(text);
      }
    };
    const finalHandler = fake((req, res) => {
      res.json(req.results[0]);
    });
    app.use("/user/:id", [ModelHandler(modelService, logger), finalHandler]);

    request(app)
      .patch('/user/' + fakeId)
      .set({'TOKEN_HEADER': fakeToken})
      .strictEqual('Content-Type', /json/)
      .strictEqual('Content-Length', '14')
      .strictEqual(200)
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          strictEqual(finalHandler.callCount, 1);
          strictEqual(res.body, fakeInstance);
          strictEqual(modelService.get.callCount, 0);
          strictEqual(modelService.post.callCount, 0);
          strictEqual(modelService.patch.callCount, 1);
          strictEqual(modelService.delete.callCount, 0);
          done();
        }
      });
  });

  it("ModelHandler post by id happy path", (done) => {
    const {ModelHandler} = require("../src/");

    const fakeId = "FakeId";
    const fakeToken = "FakeToken";
    const fakeInstance = "FakeInstance";
    process.env.TOKEN_HEADER = "TOKEN_HEADER";

    const app = express();
    const modelService = {
      get: fake(async (args) => {

      }),
      post: fake(async (args) => {
        strictEqual(fakeId, args.params.id);
        return fakeInstance;
      }),
      patch: fake(async (args) => {

      }),
      delete: fake(async (args) => {

      })
    };
    const logger = {
      debug: (text) => {
        console.log(text);
      }
    };
    const finalHandler = fake((req, res) => {
      res.json(req.results[0]);
    });
    app.use("/user/:id", [ModelHandler(modelService, logger), finalHandler]);

    request(app)
      .post('/user/' + fakeId)
      .set({'TOKEN_HEADER': fakeToken})
      .strictEqual('Content-Type', /json/)
      .strictEqual('Content-Length', '14')
      .strictEqual(200)
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          strictEqual(finalHandler.callCount, 1);
          strictEqual(res.body, fakeInstance);
          strictEqual(modelService.get.callCount, 0);
          strictEqual(modelService.post.callCount, 1);
          strictEqual(modelService.patch.callCount, 0);
          strictEqual(modelService.delete.callCount, 0);
          done();
        }
      });
  });

  it("ModelHandler put by id happy path", (done) => {
    const {ModelHandler} = require("../src/");

    const fakeId = "FakeId";
    const fakeToken = "FakeToken";
    const fakeInstance = "FakeInstance";
    process.env.TOKEN_HEADER = "TOKEN_HEADER";

    const app = express();
    const modelService = {
      get: fake(async (args) => {

      }),
      post: fake(async (args) => {

      }),
      patch: fake(async (args) => {
      }),
      delete: fake(async (args) => {

      }),
      put: fake(async (args) => {
        strictEqual(fakeId, args.params.id);
        return fakeInstance;
      })
    };
    const logger = {
      debug: (text) => {
        console.log(text);
      }
    };
    const finalHandler = fake((req, res) => {
      res.json(req.results[0]);
    });
    app.use("/user/:id", [ModelHandler(modelService, logger), finalHandler]);

    request(app)
      .put('/user/' + fakeId)
      .set({'TOKEN_HEADER': fakeToken})
      .strictEqual('Content-Type', /json/)
      .strictEqual('Content-Length', '14')
      .strictEqual(200)
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          strictEqual(finalHandler.callCount, 1);
          strictEqual(res.body, fakeInstance);
          strictEqual(modelService.get.callCount, 0);
          strictEqual(modelService.post.callCount, 0);
          strictEqual(modelService.patch.callCount, 0);
          strictEqual(modelService.put.callCount, 1);
          strictEqual(modelService.delete.callCount, 0);
          done();
        }
      });
  });

  it("ModelHandler delete by id happy path", (done) => {
    const {ModelHandler} = require("../src/");

    const fakeId = "FakeId";
    const fakeToken = "FakeToken";
    const fakeInstance = "FakeInstance";
    process.env.TOKEN_HEADER = "TOKEN_HEADER";

    const app = express();
    const modelService = {
      get: fake(async (args) => {

      }),
      post: fake(async (args) => {

      }),
      patch: fake(async (args) => {

      }),
      delete: fake(async (args) => {
        strictEqual(fakeId, args.params.id);
        return fakeInstance;
      })
    };
    const logger = {
      debug: (text) => {
        console.log(text);
      }
    };
    const finalHandler = fake((req, res) => {
      res.json(req.results[0]);
    });
    app.use("/user/:id", [ModelHandler(modelService, logger), finalHandler]);

    request(app)
      .delete('/user/' + fakeId)
      .set({'TOKEN_HEADER': fakeToken})
      .strictEqual('Content-Type', /json/)
      .strictEqual('Content-Length', '14')
      .strictEqual(200)
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          strictEqual(finalHandler.callCount, 1);
          strictEqual(res.body, fakeInstance);
          strictEqual(modelService.get.callCount, 0);
          strictEqual(modelService.post.callCount, 0);
          strictEqual(modelService.patch.callCount, 0);
          strictEqual(modelService.delete.callCount, 1);
          done();
        }
      });
  });

  it("ModelHandler custom method not implemented", (done) => {
    const {ModelHandler} = require("../src/");

    ModelHandler()({method: "custom"}, undefined, (e) => {
      strictEqual(e.name, "MethodNotImplementedError");
      strictEqual(e.message, "method custom not implemented!");
      done();
    });
  });

  it("ModelHandler get method throws", (done) => {
    const {ModelHandler} = require("../src/");
    const err = new Error("bla");
    const modelService = {
      get: fake(async (args) => {
        throw err;
      }),
      post: fake(async (args) => {

      }),
      patch: fake(async (args) => {

      }),
      delete: fake(async (args) => {

      })
    };
    ModelHandler(modelService)({method: "get"}, undefined, (e) => {
      strictEqual(e, err);
      strictEqual(e.message, "bla");
      done();
    });
  });

  it("ModelHandler delete method throws", (done) => {
    const {ModelHandler} = require("../src/");
    const err = new Error("blp");
    const modelService = {
      get: fake(async (args) => {

      }),
      post: fake(async (args) => {

      }),
      patch: fake(async (args) => {

      }),
      delete: fake(async (args) => {
        throw err;
      })
    };
    ModelHandler(modelService)({method: "delete"}, undefined, (e) => {
      strictEqual(e, err);
      strictEqual(e.message, "blp");
      done();
    });
  });*/
});
