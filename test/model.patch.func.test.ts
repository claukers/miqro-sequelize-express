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
        strictEqual(result[0], 2);
      }

    })().then(done).catch(done);
  });
});
