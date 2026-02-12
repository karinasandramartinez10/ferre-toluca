import { describe, it, expect } from "vitest";
import { runIfFn } from "../../utils/function";

describe("runIfFn", () => {
  it("calls the function and returns its result", () => {
    const fn = (x: number) => x * 2;
    expect(runIfFn(fn, 5)).toBe(10);
  });

  it("returns the value as-is if not a function", () => {
    expect(runIfFn("hello")).toBe("hello");
    expect(runIfFn(42)).toBe(42);
    expect(runIfFn(null)).toBeNull();
  });

  it("passes multiple arguments to the function", () => {
    const fn = (a: number, b: number) => a + b;
    expect(runIfFn(fn, 3, 7)).toBe(10);
  });
});
