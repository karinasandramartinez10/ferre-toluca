import { describe, it, expect } from "vitest";
import { withPricingMode } from "../../utils/params";

describe("withPricingMode", () => {
  it("adds pricingMode when truthy", () => {
    const params = { page: 1 };
    withPricingMode(params, "wholesale");
    expect(params).toEqual({ page: 1, pricingMode: "wholesale" });
  });

  it("does not add pricingMode when undefined", () => {
    const params = { page: 1 };
    withPricingMode(params, undefined);
    expect(params).toEqual({ page: 1 });
    expect(params).not.toHaveProperty("pricingMode");
  });

  it("does not add pricingMode when empty string", () => {
    const params = { page: 1 };
    withPricingMode(params, "");
    expect(params).not.toHaveProperty("pricingMode");
  });

  it("returns the same object reference", () => {
    const params = { page: 1 };
    const result = withPricingMode(params, "retail");
    expect(result).toBe(params);
  });
});
