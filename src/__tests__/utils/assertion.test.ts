import { describe, it, expect } from "vitest";
import { isFunction } from "../../utils/assertion";

describe("isFunction", () => {
  it("returns true for a function", () => {
    expect(isFunction(() => {})).toBe(true);
    expect(isFunction(function named() {})).toBe(true);
  });

  it("returns false for non-function values", () => {
    expect(isFunction("string")).toBe(false);
    expect(isFunction(42)).toBe(false);
    expect(isFunction(null)).toBe(false);
    expect(isFunction(undefined)).toBe(false);
    expect(isFunction({})).toBe(false);
    expect(isFunction([])).toBe(false);
  });
});
