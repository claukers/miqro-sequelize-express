import { NoNameParseOption, ParseOption, parseOptionMap2ParseOptionList, Session, SimpleMap, SimpleTypes } from "@miqro/core";

import { Includeable, IncludeOptions, Model, ModelCtor, Transaction, WhereOptions } from "sequelize";

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

export interface ModelServiceOptions {
  orderColumnsValues?: string[];
  searchColumnsValues?: string[];
  groupColumnsValues?: string[];
  attributeValues?: string[];
  include?: IncludeOptions | {
    all: true;
    nested?: true | undefined;
  } | Includeable[];
  paginationOptions?: {
    maxLimit: number;
    defaultLimit: number;
  }
}

// ?group=name&group=bla
export const GROUP_PARSE_OPTION_MAP = (groupColumns: string[]): SimpleMap<NoNameParseOption> => {
  return {
    group: {
      type: "array",
      required: false,
      arrayType: "enum",
      enumValues: groupColumns,
      arrayMinLength: 1,
      forceArray: true,
      description: "a list of attributes by which the operation will be group by"
    }
  }
};
export const GROUP_PARSE_OPTIONS = (groupColumns: string[]): ParseOption[] =>
  parseOptionMap2ParseOptionList(GROUP_PARSE_OPTION_MAP(groupColumns));

// ?attributes=id&attributes=sum,amount,total
export const ATTIBUTE_PARSE_OPTION_MAP = (attributeValues: string[]): SimpleMap<NoNameParseOption> => {
  return {
    attributes: {
      type: "array",
      required: false,
      arrayType: "enum",
      enumValues: attributeValues,
      arrayMinLength: 1,
      forceArray: true,
      description: "a list of attributes that the operation will try to obtain"
    }
  }
};
export const ATTIBUTE_PARSE_OPTIONS = (attributeValues: string[]): ParseOption[] =>
  parseOptionMap2ParseOptionList(ATTIBUTE_PARSE_OPTION_MAP(attributeValues));

export const DEFAULT_PAGINATION_OPTIONS = {
  maxLimit: 150,
  defaultLimit: 10
}

// ?limit=10&offset=0
export const PAGINATION_PARSE_OPTION_MAP = ({ defaultLimit, maxLimit } = DEFAULT_PAGINATION_OPTIONS): SimpleMap<NoNameParseOption> => {
  return {
    limit: {
      type: "number",
      required: false,
      defaultValue: defaultLimit,
      numberMax: maxLimit,
      numberMin: 0,
      description: "the limit of number of results for the operation"
    },
    offset: {
      type: "number",
      required: false,
      defaultValue: 0,
      numberMin: 0,
      description: "the offset for the results for the operation"
    }
  };
};
export const PAGINATION_PARSE_OPTIONS = (options = DEFAULT_PAGINATION_OPTIONS): ParseOption[] =>
  parseOptionMap2ParseOptionList(PAGINATION_PARSE_OPTION_MAP(options));

// ?columns=name&columns=age&q=text
export const SEARCH_PARSE_OPTION_MAP = (searchColumns: string[]): SimpleMap<NoNameParseOption> => {
  return {
    columns: {
      type: "array",
      required: false,
      arrayType: "enum",
      enumValues: searchColumns,
      arrayMinLength: 1,
      forceArray: true,
      description: "the columns by which the operation will be filtered using the req.query.q"
    },
    q: {
      type: "string",
      required: false,
      description: "the value by which the operation will be filtered using req.query.columns"
    }
  }
};
export const SEARCH_PARSE_OPTIONS: (searchColumns: string[]) => ParseOption[] = (searchColumns: string[]) =>
  parseOptionMap2ParseOptionList(SEARCH_PARSE_OPTION_MAP(searchColumns));

// ?order=name,DESC&order=age,ASC
export const ORDER_PARSE_OPTION_MAP = (orderColumns: string[]): SimpleMap<NoNameParseOption> => {
  let enumValues = orderColumns.map(c => `${c},DESC`);
  enumValues = enumValues.concat(orderColumns.map(c => `${c},ASC`));
  return {
    order: {
      type: "array",
      forceArray: true,
      arrayMinLength: 1,
      arrayType: "enum",
      enumValues,
      required: false,
      description: "a list of ATTRIBUTE,DESC or ATTRIBUTE,ASC that will alter the order result of the operation"
    }
  }
};
export const ORDER_PARSE_OPTIONS = (orderColumns: string[]): ParseOption[] =>
  parseOptionMap2ParseOptionList(ORDER_PARSE_OPTION_MAP(orderColumns));
