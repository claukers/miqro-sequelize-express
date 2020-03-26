[@miqro/modelhandlers](../README.md) › [Globals](../globals.md) › ["index"](_index_.md)

# Module: "index"

## Index

### Functions

* [MapModelHandler](_index_.md#const-mapmodelhandler)
* [ModelHandler](_index_.md#const-modelhandler)

## Functions

### `Const` MapModelHandler

▸ **MapModelHandler**(`callbackfn`: function, `logger?`: any): *INextHandlerCallback*

*Defined in [index.ts:11](https://github.com/claukers/miqro-sequelize-express/blob/639c4be/src/index.ts#L11)*

**Parameters:**

▪ **callbackfn**: *function*

▸ (`value`: any, `index`: number, `array`: any[], `req`: any): *any*

**Parameters:**

Name | Type |
------ | ------ |
`value` | any |
`index` | number |
`array` | any[] |
`req` | any |

▪`Optional`  **logger**: *any*

**Returns:** *INextHandlerCallback*

___

### `Const` ModelHandler

▸ **ModelHandler**(`service`: IModelService, `logger?`: any): *INextHandlerCallback*

*Defined in [index.ts:44](https://github.com/claukers/miqro-sequelize-express/blob/639c4be/src/index.ts#L44)*

**Parameters:**

Name | Type |
------ | ------ |
`service` | IModelService |
`logger?` | any |

**Returns:** *INextHandlerCallback*
