# @miqro/modelhandlers

this modules provides express handlers for exposing sequelize **models**. 

mapping http request to the ``sequelize::Model<T, T>`` corresponding findbyPK, findALl, findAllAndCount, create, createBulk, update, updateBulk and delete. 

```javascript
...
/*
* GET /post/
* GET /post/:id
* PATCH /post/:id
* POST /post/
*/
app.use("/post/:id?", [
  ModelHandler(new ModelService(new Database().models.post)), 
  ResponseHandler()
]);
...
app.use(ErrorHandler()); // this will catch some sequelize errors and return a http response
...
```

##### [OPTIONAL] query params

- req.query.pagination

    ```json
    ?pagination=...
    ```

- req.query.pagination.search

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
        } // every result from the ModelHandler will be mapped to this even if result is paginated
    }),
    ResponseHandler(...) 
]);
...
```
