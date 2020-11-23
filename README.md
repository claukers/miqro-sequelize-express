# @miqro/modelhandlers

this module provides express handlers for exposing sequelize **models**. 

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
  ModelHandler(new ModelService(db.models.post, {
    disableAttributesQuery: false, // disable req.query.attributes
    include: {
        ...
    },
    disableOrderQuery: false, // disable req.query.order
    disableGroupQuery: false, // disable req.query.group
    disablePaginationQuery: false, // disable req.query.limit and req.query.offset
    disableSearchQuery: false // disable req.query.q and req.query.columns
  }), ...), 
  ResponseHandler(...)
]);
...
app.use(ErrorHandler(...)); // this will catch some sequelize errors and return an appropiate http response
...
```

##### [OPTIONAL] query params

###### pagination

```
?limit=10&offset=0
```

###### search by like

```
?columns=name&columns=age&q=text
```

###### order

```
?order=name,DESC&order=age,ASC
```

###### group by

```
?group=name&group=age
```

###### attributes

```
?attributes=id&attributes=sum,amount,total
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
