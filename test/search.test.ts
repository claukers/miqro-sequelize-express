import { describe, it } from "mocha";
import { resolve } from "path";
import { strictEqual } from "assert";
import { getWhereOptions } from "../src"

describe("search tests", function(){
  it(`happy path search`, async () => {
    const modelsPath = resolve(__dirname, "data", "search", "happypath", "db", "models", "index.js");
    const models = require(modelsPath);
    await models.bla.sync({force: true});
    await models.bla.truncate();
    await models.bla.bulkCreate([{
      name: "bla",
      surname: "bli",
      email: "blo",
      domain: "jj"
    },{
      name: "bla",
      surname: "blo",
      email: "lba",
      domain: "jj"
    },{
      name: "bla",
      surname: "bli",
      email: "blo",
      domain: "pp"
    }])
    const result = await models.bla.findAll({
      where: getWhereOptions({
        filter: {
          domain: "jj"
        },
        q: "bla bli",
        columns: ["name", "surname", "email"]
      })
    });
    strictEqual(result.length, 1);
    const result2 = await models.bla.findAll({
      where: getWhereOptions({
        filter: {
          domain: "jj"
        },
        q: "bla",
        columns: ["name", "surname", "email"]
      })
    });
    strictEqual(result2.length, 2);
    const result3 = await models.bla.findAll({
      where: getWhereOptions({
        filter: {
        },
        q: "bli",
        columns: ["name", "surname", "email"]
      })
    });
    strictEqual(result3.length, 2);
    const result4 = await models.bla.findAll({
      where: getWhereOptions({
        filter: {
          domain: "jj"
        },
        q: "bli",
        columns: ["name", "surname", "email"]
      })
    });
    strictEqual(result4.length, 1);
  });
})
