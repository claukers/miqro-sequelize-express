import {ParseOption, Session, SimpleMap, SimpleTypes} from "@miqro/core";

import {Model, ModelCtor, Transaction, WhereOptions} from "sequelize";

export interface ModelServiceArgs {
  body: SimpleMap<SimpleTypes>;
  query: SimpleMap<SimpleTypes>;
  params: SimpleMap<SimpleTypes>;
  session?: Session;
}

export type ModelServiceGetResult<T = any> =
  Model<T>[]
  | { rows: Model<T>[]; count: number | { name: string; count: number; }[] };

export type ModelServicePostResult<T = any> = Model<T> | Model<T>[];

export type ModelServicePatchResult = number;

export type ModelServiceDeleteResult = number;

export interface ModelServiceInterface<T = any> {
  get(options: ModelServiceArgs, transaction?: Transaction, skipLocked?: boolean): Promise<ModelServiceGetResult<T>>;

  post(options: ModelServiceArgs, transaction?: Transaction): Promise<ModelServicePostResult<T>>;

  put(options: ModelServiceArgs, transaction?: Transaction): Promise<ModelServicePostResult<T>>;

  patch(options: ModelServiceArgs, transaction?: Transaction): Promise<ModelServicePatchResult>;

  delete(options: ModelServiceArgs, transaction?: Transaction): Promise<ModelServiceDeleteResult | ModelServicePatchResult>;
}

export type ModelServiceInclude<T = any> = {
  model: ModelCtor<Model<T>>;
  required?: boolean;
  where?: WhereOptions,
  include?: {
    model: ModelCtor<Model<T>>;
    required?: boolean;
    where?: WhereOptions,
    include?: {
      model: ModelCtor<Model<T>>;
      required?: boolean;
      where?: WhereOptions,
      include?: {
        model: ModelCtor<Model<T>>;
        required?: boolean;
        where?: WhereOptions
      }[]
    }[]
  }[]
}[];

export interface ModelServiceOptions {
  disableAttributesQuery?: boolean;
  include?: ModelServiceInclude;
  disableOrderQuery?: boolean;
  disableGroupQuery?: boolean;
  disablePaginationQuery?: boolean;
  disableSearchQuery?: boolean;
}

// ?group=name&group=bla
export const groupParseOption: ParseOption = {
  name: "group", type: "array", arrayType: "string", arrayMinLength: 1, required: false,
  description: "a list of attributes by which the operation will be group by"
};

// ?attributes=id&attributes=sum,amount,total
export const attributesParseOption: ParseOption = {
  name: "attributes", type: "array", arrayType: "string", arrayMinLength: 1, required: false,
  description: "a list of attributes that the operation will try to obtain"
};

// ?limit=10&offset=0
export const paginationParseOption: ParseOption[] = [
  {
    name: "limit", type: "number", required: false,
    description: "the limit of number of results for the operation"
  },
  {
    name: "offset", type: "number", required: false,
    description: "the offset for the results for the operation"
  }
];

// ?columns=name&columns=age&q=text
export const searchParseOption: ParseOption[] = [
  {
    name: "columns", type: "array", arrayType: "string", arrayMinLength: 1, required: false,
    description: "the columns by which the operation will be filtered using the req.query.q"
  },
  {
    name: "q", type: "string", required: false,
    description: "the value by which the operation will be filtered using req.query.columns"
  }
];

// ?order=name,DESC&order=age,ASC
export const orderParseOption: ParseOption = {
  name: "order",
  type: "array",
  arrayMinLength: 1,
  arrayType: "string",
  required: false,
  description: "a list of <ATTRIBUTE>,[DESC|ASC] that will alter the order result of the operation"
};
