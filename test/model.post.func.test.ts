import {resolve} from "path";
import {ModelService} from "../src";
import {describe, it} from "mocha";

import {Util} from "@miqro/core";
import {strictEqual} from "assert";
import { Database } from "@miqro/database";

process.env.NODE_ENV = "test";
process.env.MIQRO_DIRNAME = resolve(__dirname, "data");
process.chdir(process.env.MIQRO_DIRNAME);
Util.loadConfig();

const models = Database.getInstance().models;

describe("ModelService Func Tests", function () {
  this.timeout(100000);

  it("happy path post", (done) => {
    (async () => {
      const service = new ModelService(models.post2);
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
      const service = new ModelService(models.post2);
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

  it("happy path patchlist", (done) => {
    (async () => {
      const service = new ModelService(models.post2);
      const result = await service.patch({
        params: {
          text: "text1"
        },
        query: {},
        body: {
          bla7: "bla7"
        }
      });
      if (!result) {
        strictEqual(true, false);
      } else {
        strictEqual(result.count, 2);
      }

    })().then(done).catch(done);
  });
});
