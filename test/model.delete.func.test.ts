import { resolve } from "path";
import { FakeDeleteModelService, ModelService } from "../src";
import { describe, it } from "mocha";

import { Util } from "@miqro/core";
import { strictEqual } from "assert";
import { Database } from "@miqro/database";

process.env.NODE_ENV = "test";
process.env.MIQRO_DIRNAME = resolve(__dirname, "data");
process.chdir(process.env.MIQRO_DIRNAME);
Util.loadConfig();

const models = Database.getInstance().models;

describe("ModelService Func Tests", function () {
  this.timeout(100000);

  it("happy path fake deletelist", (done) => {
    (async () => {
      const fakeD = new FakeDeleteModelService(models.post);
      const all = new ModelService(models.post);

      const total = await all.get({
        params: {
          text: "text1"
        },
        query: {},
        body: {}
      });
      const total2 = await fakeD.get({
        params: {
          text: "text1"
        },
        query: {},
        body: {}
      });
      const result = await fakeD.delete({
        params: {
          text: "text1"
        },
        query: {},
        body: {}
      });
      console.log(require("util").inspect(total));
      console.log(require("util").inspect(total2));
      console.log(require("util").inspect(result));
      if (!result) {
        strictEqual(true, false);
      } else {
        strictEqual(result, total.count);
        strictEqual(total2.count, total.count);
        const totalD2 = await fakeD.get({
          params: {
            text: "text1"
          },
          query: {},
          body: {}
        });
        strictEqual(totalD2.count, 0);
        const totalA2 = await all.get({
          params: {
            text: "text1"
          },
          query: {},
          body: {}
        });
        strictEqual(totalA2.count, 2);

        const totalD4 = await fakeD.patch({
          params: {
            text: "text1"
          },
          query: {},
          body: {
            amount: 10
          }
        });
        strictEqual(totalD4, 0);

        const totalD3 = await fakeD.patch({
          params: {
            text: "text3"
          },
          query: {},
          body: {
            amount: 10
          }
        });
        strictEqual(totalD3, 1);

        await fakeD.patch({
          params: {
            text: "text3"
          },
          query: {},
          body: {
            amount: 20
          }
        });
        strictEqual(totalD3, 1);

      }

    })().then(done).catch(done);
  });
});
