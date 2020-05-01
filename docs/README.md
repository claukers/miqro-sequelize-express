[@miqro/modelhandlers](README.md) › [Globals](globals.md)

# @miqro/modelhandlers

# @miqro/modelhandlers

**in early development not to use in production**

this is a part of the ```@miqro``` modules and integrates ```@miqro/database```.

```javascript
const {
  Util
} = require("@miqro/core");
const {
  Database
} = require("@miqro/database");
const {
  ResponseHandler
} = require("@miqro/handlers");
const {
  ModelService
} = require("@miqro/modelhandlers");

const logger = Util.getLogger("posts.js");
const db = Database.getInstance();

module.exports = async (app) => {
  /*
  * GET /post/
  * GET /post/:id
  * PATCH /post/:id
  * POST /post/
  */
  app.use("/post/:id?", [
    ModelHandler(new ModelService(db.models.get, logger), 
    ResponseHandler(logger)
  ]);
  return app;
};
```

## Pagination

TODO

## Agregation

TODO

## Searching

TODO

## Mapping results

TODO

## Documentation

[globals](docs/globals.md)
