[@miqro/modelhandlers](README.md) › [Globals](globals.md)

# @miqro/modelhandlers

# @miqro/modelhandlers

this modules provides express handlers for exposing sequelize **models**. 

```javascript
const {
  Util
} = require("@miqro/core");
const {
  Database,
  ModelService
} = require("@miqro/database");
const {
  ResponseHandler
} = require("@miqro/handlers");
const {
  ModelHandler
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
    ModelHandler(new ModelService(db.models.post), logger), 
    ResponseHandler(logger)
  ]);
  return app;
};
```

##### get query params

- req.query.pagination

    TODO

    ```json
    ?pagination=...
    ```

- req.query.pagination.search

    TODO

    ```json
    ?pagination={..."search": {...},...}
    ```

- req.query.include

    this is used as the **include** argument in **sequelize::model::findAll**, **sequelize::model::findByPk** and .... 

    ```json
    ?include=[...]
    ```

##### MapModelHandler(...)

```javascript
...
app.use(.., [
    ModelHandler(...),
    MapModelHandler((value, index, array, req) => {
        return {
            ... 
        } // every result from the ModelHandler will be mapped by this
    }),
    ResponseHandler(...) 
]);

...
```

### documentation

[globals](docs/globals.md)
