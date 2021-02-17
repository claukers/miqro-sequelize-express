import { ParseOption, ParseOptionMap, parseOptionMap2ParseOptionList, parseOptions, ParseOptionsError, SimpleMap } from "@miqro/core";
import {
  Op as SequelizeOp,
  fn as SequelizeFn,
  col as SequelizeCol,
  FindAttributeOptions
} from "sequelize";

// ?group=name&group=bla
export const GROUP = (groupColumns: string[]): ParseOptionMap => {
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
export const GROUP_OPTIONS = (groupColumns: string[]): ParseOption[] =>
  parseOptionMap2ParseOptionList(GROUP(groupColumns));

export const DEFAULT_PAGINATION_OPTIONS = {
  maxLimit: 150,
  defaultLimit: 10
}

// ?limit=10&offset=0
export const PAGINATION = ({ defaultLimit, maxLimit } = DEFAULT_PAGINATION_OPTIONS): ParseOptionMap => {
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
export const PAGINATION_OPTIONS = (options = DEFAULT_PAGINATION_OPTIONS): ParseOption[] =>
  parseOptionMap2ParseOptionList(PAGINATION(options));

// ?columns=name&columns=age&q=text
export const SEARCH = (searchColumns: string[]): ParseOptionMap => {
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
export const SEARCH_OPTIONS: (searchColumns: string[]) => ParseOption[] = (searchColumns: string[]) =>
  parseOptionMap2ParseOptionList(SEARCH(searchColumns));

// ?order=name,DESC&order=age,ASC
export const ORDER = (orderColumns: string[]): ParseOptionMap => {
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
export const ORDER_OPTIONS = (orderColumns: string[]): ParseOption[] =>
  parseOptionMap2ParseOptionList(ORDER(orderColumns));

export type LikeSearch = SimpleMap<{
  [SequelizeOp.or]: {
    [SequelizeOp.like]: string;
  }
}>;

export const getLikeSearch = ({ q, columns }: { q: string; columns: string[]; }): LikeSearch => {
  const searchParams: LikeSearch = {};
  if (q !== undefined && columns !== undefined && q !== "") {
    for (const c of (columns as string[])) {
      searchParams[c] = {
        [SequelizeOp.or]: {
          [SequelizeOp.like]: "%" + q + "%"
        }
      };
    }
  }
  return searchParams;
}

const ignoreUndefined = (args: SimpleMap<any>): SimpleMap<any> => {
  const keys = Object.keys(args);
  for (const key of keys) {
    if (args[key] === undefined) {
      delete args[key];
    }
  }
  return args;
};

export const getWhereOptions = ({ filter, q, columns }: { filter: SimpleMap<any>; q?: string; columns?: string[]; }): LikeSearch => {
  return q && columns ? {
    [SequelizeOp.and]: {
      ...ignoreUndefined(filter)
    },
    [SequelizeOp.or]: getLikeSearch({ q, columns })
  } : {
      ...ignoreUndefined(filter)
    };
}

export const parseAttributes = (attributes: string[]): FindAttributeOptions => {
  const ret: FindAttributeOptions = [];
  for (let i = 0; i < (attributes as string[]).length; i++) {
    const att = (attributes as string[])[i];
    const fn = att.split(",").map(s => s.trim());
    if (fn.length > 1) {
      // att is a SequelizeFN not a column string
      if (fn.length !== 3) {
        throw new ParseOptionsError(`query.attributes [${att}] not valid!`);
      }
      const [fnName, col, name] = fn;
      parseOptions(`query.attributes`, { fn: fnName, col, name }, [
        { name: "fn", type: "enum", enumValues: ["sum"], required: true },
        { name: "col", type: "string", required: true },
        { name: "name", type: "string", required: true }
      ], "no_extra");

      try {
        ret.push([SequelizeFn(fnName, SequelizeCol(col as string)), name as string]);
      } catch (e) {
        throw new ParseOptionsError(`bad query.attribute [${attributes}]`);
      }
    } else {
      ret.push(att);
    }
  }
  return ret;
};

export * from "./audit";
