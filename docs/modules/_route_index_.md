[miqro-sequelize-express](../README.md) › [Globals](../globals.md) › ["route/index"](_route_index_.md)

# Module: "route/index"

## Index

### Functions

* [ModelHandler](_route_index_.md#const-modelhandler)
* [ModelRouter](_route_index_.md#const-modelrouter)

## Functions

### `Const` ModelHandler

▸ **ModelHandler**(`service`: IModelService, `logger?`: any): *function*

*Defined in [src/route/index.ts:6](https://github.com/claukers/miqro-sequelize-express/blob/7dd2c2f/src/route/index.ts#L6)*

**Parameters:**

Name | Type |
------ | ------ |
`service` | IModelService |
`logger?` | any |

**Returns:** *function*

▸ (`req`: any, `res`: any, `next`: any): *Promise‹void›*

**Parameters:**

Name | Type |
------ | ------ |
`req` | any |
`res` | any |
`next` | any |

___

### `Const` ModelRouter

▸ **ModelRouter**(`service`: IModelService, `router?`: Router, `logger?`: any): *Router‹›*

*Defined in [src/route/index.ts:25](https://github.com/claukers/miqro-sequelize-express/blob/7dd2c2f/src/route/index.ts#L25)*

**Parameters:**

Name | Type |
------ | ------ |
`service` | IModelService |
`router?` | Router |
`logger?` | any |

**Returns:** *Router‹›*
