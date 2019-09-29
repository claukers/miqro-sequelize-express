# miqro-sequelize-express

**in early development not to use in production**

this is a part of the ```miqro``` module and provides miqro services for sequelize models and a router to expose them.

- ModelRoute, ModelService base classes.
  - route and service for exposing models with pagination, agregation and searching utilities.

```javascript
const {
  Util
} = require("miqro-core");
const {
  Database
} = require("miqro-sequelize");
const {
  ModelRoute,
  ModelService
} = require("miqro-sequelize-express");

const logger = Util.getLogger("posts.js");
const db = Database.getInstance();

module.exports = async (app) => {
  /*
  * GET /post/
  * GET /post/:id
  * PATCH /post/:id
  * POST /post/
  * 
  * for model db.models.post
  * to allow delete add it to the allowedMethods list
  */
  app.use("/post",
    new ModelRoute(
      new ModelService(
        db.models.post
      ),
      {
        allowedMethods: ["GET", "POST", "PATCH"]
      }).routes());
  return app;
};
```

## Pagination

TODO

## Agregation

TODO

## Searching

TODO
