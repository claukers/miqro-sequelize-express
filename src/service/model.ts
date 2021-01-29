import { ParseOption, Session, SimpleMap, SimpleTypes } from "@miqro/core";

import { Model, ModelCtor, Transaction, WhereOptions } from "sequelize";

export interface ModelServiceArgs {
  body: SimpleMap<SimpleTypes>;
  query: SimpleMap<SimpleTypes>;
  params: SimpleMap<SimpleTypes>;
  session?: Session;
}

export type ModelServiceGetResult<T = any, T2 = any> = { rows: Model<T, T2>[]; count: number | { name: string; count: number; }[] };

export type ModelServicePostResult<T = any, T2 = any> = Model<T, T2> | Model<T, T2>[];

export type ModelServicePatchResult<T = any, T2 = any> = { count: number, rows?: Model<T, T2>[] };

export type ModelServiceDeleteResult = { count: number };

export interface ModelServiceInterface<T = any, T2 = any> {
  get(options: ModelServiceArgs, transaction?: Transaction, skipLocked?: boolean): Promise<ModelServiceGetResult<T, T2>>;

  post(options: ModelServiceArgs, transaction?: Transaction): Promise<ModelServicePostResult<T, T2>>;

  put(options: ModelServiceArgs, transaction?: Transaction): Promise<ModelServicePostResult<T, T2>>;

  patch(options: ModelServiceArgs, transaction?: Transaction): Promise<ModelServicePatchResult<T, T2>>;

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
  searchColumns?: string[];
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
    defaultValue: 10,
    numberMax: 150,
    numberMin: 0,
    description: "the limit of number of results for the operation"
  },
  {
    name: "offset", type: "number", required: false,
    defaultValue: 0,
    numberMin: 0,
    description: "the offset for the results for the operation"
  }
];

// ?columns=name&columns=age&q=text
export const searchParseOption: (searchColumns?: string[]) => ParseOption[] = (searchColumns?: string[]) => [
  {
    name: "columns", type: "array", arrayType: searchColumns ? "enum" : "string", enumValues: searchColumns, arrayMinLength: 1, required: false,
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
  description: "a list of ATTRIBUTE,DESC or ATTRIBUTE,ASC that will alter the order result of the operation"
};
