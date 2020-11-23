import {resolve} from "path";
import {ModelService, PostListModelService} from "../src";
import {describe, it} from "mocha";

import {Database, Util} from "@miqro/core";
import {strictEqual} from "assert";

process.env.NODE_ENV = "test";
process.env.MIQRO_DIRNAME = resolve(__dirname, "data");
process.chdir(process.env.MIQRO_DIRNAME);
Util.loadConfig();

describe("ModelService Func Tests", function () {
  this.timeout(100000);

  it("happy path post", (done) => {
    (async () => {
      const db = new Database();
      const service = new ModelService(db.models.post2);
      const result = await service.post({
        params: {},
        query: {},
        body: {
          name: "bla"
        }
      });
      if (!result) {
        strictEqual(true, false);
      } else {
        strictEqual((result as any).name, "bla");
      }

    })().then(done).catch(done);
  });

  it("happy path postlist", (done) => {
    (async () => {
      const db = new Database();
      const service = new PostListModelService(db.models.post2);
      const result = await service.post({
        params: {},
        query: {},
        body: [{
          name: "bla"
        }, {
          name: "ble"
        }] as any
      });
      if (!result) {
        strictEqual(true, false);
      } else {
        strictEqual((result as any)[0].name, "bla");
        strictEqual((result as any)[1].name, "ble");
      }

    })().then(done).catch(done);
  });
});
