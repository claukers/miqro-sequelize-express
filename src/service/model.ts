import {ParseOption, Session, SimpleMap, SimpleTypes} from "@miqro/core";

export interface ModelServiceArgs {
  body: SimpleMap<SimpleTypes>;
  query: SimpleMap<SimpleTypes>;
  params: SimpleMap<SimpleTypes>;
  session?: Session;
}

export interface ModelDAOInstance<T = any> {
  dataValues: T;

  update(patch: any, options?: { transaction: any; }): Promise<ModelDAOInstance>;

  destroy(options?: { transaction: any; }): Promise<ModelDAOInstance>;
}

export type ModelDAOFindAndCountAllResult<T=any> = { rows: ModelDAOInstance<T>[]; count: number | { name: string; count: number; }[] };

export type ModelDAOFindAllResult<T=any> = ModelDAOInstance<T>[];

export type ModelGetResult =
  ModelDAOFindAllResult
  | ModelDAOFindAndCountAllResult;

export type ModelPostResult = any | any[];

export type ModelPatchResult = any | any[] | null;

export type ModelDeleteResult = void | void[] | null;

export interface ModelServiceInterface {
  get(options: ModelServiceArgs, transaction?: any, skipLocked?: boolean): Promise<any>;

  post(options: ModelServiceArgs, transaction?: any): Promise<any>;

  put(options: ModelServiceArgs, transaction?: any): Promise<any>;

  patch(options: ModelServiceArgs, transaction?: any): Promise<any>;

  delete(options: ModelServiceArgs, transaction?: any): Promise<any>;
}

export interface ModelDAO<T=any> {
  findAndCountAll(args: {
    attributes?: any;
    where?: any;
    order?: any[][];
    include?: ModelServiceInclude;
    limit: number;
    offset: number;
    group?: string[];
    transaction?: any;
    lock?: boolean;
    skipLocked?: boolean;
  }): Promise<ModelDAOFindAndCountAllResult<T>>;

  findAll(args: {
    attributes?: any;
    where: any;
    order?: any[][];
    include?: ModelServiceInclude;
    group?: string[];
    transaction?: any;
    lock?: boolean;
    skipLocked?: boolean;
  }): Promise<ModelDAOFindAllResult<T>>;

  create(args: any, options?: {
    transaction: any;
  }): Promise<ModelDAOInstance<T>>;

  bulkCreate(args: any[], options?: {
    transaction: any;
  }): Promise<ModelDAOInstance<T>[]>;
}

export type ModelServiceInclude = {
  model: any;
  required?: boolean;
  where?: any,
  include?: {
    model: any;
    required?: boolean;
    where?: any,
    include?: {
      model: any;
      required?: boolean;
      where?: any,
      include?: {
        model: any;
        required?: boolean;
        where?: any
      }[]
    }[]
  }[]
}[];

export interface ModelServiceOptions {
  enableMultiInstanceDelete?: boolean;
  enableMultiInstancePatch?: boolean;
  disableAttributesQuery?: boolean;
  include?: ModelServiceInclude;
  disableOrderQuery?: boolean;
  disableGroupQuery?: boolean;
  disablePaginationQuery?: boolean;
  disableSearchQuery?: boolean;
}

// ?group=name&group=bla
export const groupParseOption: ParseOption = {
  name: "group", type: "array", arrayType: "string", required: false
};

// ?attributes=id&attributes=sum,amount,total
export const attributesParseOption: ParseOption = {
  name: "attributes", type: "array", required: false
};

// ?limit=10&offset=0
export const paginationParseOption: ParseOption[] = [
  {name: "limit", type: "number", required: false},
  {name: "offset", type: "number", required: false}
];

// ?columns=name&columns=age&q=text
export const searchParseOption: ParseOption[] = [
  {name: "columns", type: "array", arrayType: "string", arrayMinLength: 1, required: false},
  {name: "q", type: "string", required: false}
];

// ?order=name,DESC&order=age,ASC
export const orderParseOption: ParseOption = {
  name: "order",
  type: "array",
  arrayMinLength: 1,
  arrayType: "string",
  required: false
};
