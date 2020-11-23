import {resolve} from "path";
import {ModelService} from "../src";
import {describe, it} from "mocha";

import {Util} from "@miqro/core";
import {strictEqual} from "assert";

process.env.NODE_ENV = "test";
process.env.MIQRO_DIRNAME = resolve(__dirname, "data");
process.chdir(process.env.MIQRO_DIRNAME);
Util.loadConfig();

const models = require(resolve(__dirname, "data", "db", "models"));

describe("ModelService Func Tests", function () {
  this.timeout(100000);

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
      console.log(result);
      console.log(result);
      if (!result) {
        strictEqual(true, false);
      } else {
        strictEqual(result, 2);
      }

    })().then(done).catch(done);
  });
});
