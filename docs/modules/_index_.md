[@miqro/modelhandlers](../README.md) › [Globals](../globals.md) › ["index"](_index_.md)

# Module: "index"

## Index

### Functions

* [MapModelHandler](_index_.md#const-mapmodelhandler)
* [ModelHandler](_index_.md#const-modelhandler)

## Functions

### `Const` MapModelHandler

▸ **MapModelHandler**(`callbackfn`: function, `logger?`: Logger): *AsyncNextCallback*

*Defined in [index.ts:5](https://github.com/claukers/miqro-sequelize-express/blob/48ce98d/src/index.ts#L5)*

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

▪`Optional`  **logger**: *Logger*

**Returns:** *AsyncNextCallback*

___

### `Const` ModelHandler

▸ **ModelHandler**(`service`: ModelServiceInterface, `logger?`: Logger): *NextCallback*

*Defined in [index.ts:38](https://github.com/claukers/miqro-sequelize-express/blob/48ce98d/src/index.ts#L38)*

**Parameters:**

Name | Type |
------ | ------ |
`service` | ModelServiceInterface |
`logger?` | Logger |

**Returns:** *NextCallback*
