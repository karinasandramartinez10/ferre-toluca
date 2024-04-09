import { isFunction } from "./assertion";

export const runIfFn = (valueOrFn, ...args) =>
  isFunction(valueOrFn) ? valueOrFn(...args) : valueOrFn;