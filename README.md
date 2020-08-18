# @miqro/modelhandlers

this modules provides express handlers for exposing sequelize **models**. 

mapping http request to the ``sequelize::Model<T, T>`` corresponding findbyPK, findALl, findAllAndCount, create, createBulk, update, updateBulk and delete. 

```javascript
...
const db = new Database();
...
/*
* GET /post/
* GET /post/:id
* PATCH /post/:id
* POST /post/
* DELETE /post/:id
*/
app.use("/post/:id?", [ // all req.params like the optional :id in this example will be mapped as a WhereOptions from sequelize.
  ModelHandler(new ModelService(db.models.post, ...), ...), 
  ResponseHandler(...)
]);
...
app.use(ErrorHandler(...)); // this will catch some sequelize errors and return an appropiate http response
...
```

##### [OPTIONAL] query params

- req.query.pagination

    ```json
    ?pagination={"limit": ..., "offset": ..., ...}
    ```

- req.query.pagination.search

    ```json
    ?pagination={..."search": {"query": ..., "columns": [...], ...}, ...}
    ```

- req.query.include

    this is used as the **include** argument in **sequelize::model::findAll**, **sequelize::model::findByPk** and .... 

    ```json
    ?include=[{"model": ..., "required": ..., "attributes": [...], "where": {...}, ...}]
    ```

##### MapModelHandler(...)

```javascript
...
app.use(.., [
    ModelHandler(...),
    MapModelHandler((value, index, array, req) => { // same cb as Array.map but with req added
        return {
            ... 
        } // every result from the ModelHandler will be mapped to this even if result is paginated
    }),
    ResponseHandler(...) 
]);
...
```
