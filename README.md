# @miqro/modelhandlers

this module provides some transformation for sequelize calls and AuditHandler.


```javascript
...
const {parseOptions} = require("@miqro/core");
const {getWhereOptions, GROUP, ORDER, PAGINATION, GROUP} = require("@miqro/modelhandlers");
...
const {limit, offset, group, q, columns} = parseOptions("query", req.query, {
  ...ORDER(["createdAt", "id"]),
  ...GROUP(["status"]),
  ...SEARCH(["id"]),
  ...PAGINATION({
    defaultLimit: 10,
    maxlimit: 150
  })
} , "no_extra");
const {order} = req.query.order ? parseOrder(req.query.order) : undefined;
...
modelA.findAndCountAll({
  where: getWhereOptions({
    q, columns,
    filter: {
      ...
    }
  }),
  limit,
  offset,
  group,
  order
})
...
```
