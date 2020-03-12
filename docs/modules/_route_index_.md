[@miqro/modelhandlers](../README.md) › [Globals](../globals.md) › ["route/index"](_route_index_.md)

# Module: "route/index"

## Index

### Functions

* [MapModelHandler](_route_index_.md#const-mapmodelhandler)
* [ModelHandler](_route_index_.md#const-modelhandler)
* [ModelRouter](_route_index_.md#const-modelrouter)

## Functions

### `Const` MapModelHandler

▸ **MapModelHandler**(`callbackfn`: function, `logger?`: any): *function*

*Defined in [src/route/index.ts:6](https://github.com/claukers/miqro-sequelize-express/blob/36335f1/src/route/index.ts#L6)*

**Parameters:**

▪ **callbackfn**: *function*

▸ (`value`: any, `index`: number, `array`: any[]): *any*

**Parameters:**

Name | Type |
------ | ------ |
`value` | any |
`index` | number |
`array` | any[] |

▪`Optional`  **logger**: *any*

**Returns:** *function*

▸ (`req`: any, `res`: any, `next`: any): *Promise‹void›*

**Parameters:**

Name | Type |
------ | ------ |
`req` | any |
`res` | any |
`next` | any |

___

### `Const` ModelHandler

▸ **ModelHandler**(`service`: IModelService, `logger?`: any): *function*

*Defined in [src/route/index.ts:33](https://github.com/claukers/miqro-sequelize-express/blob/36335f1/src/route/index.ts#L33)*

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

*Defined in [src/route/index.ts:52](https://github.com/claukers/miqro-sequelize-express/blob/36335f1/src/route/index.ts#L52)*

**Parameters:**

Name | Type |
------ | ------ |
`service` | IModelService |
`router?` | Router |
`logger?` | any |

**Returns:** *Router‹›*
