import { describe, it, expect } from "vitest";
import { PRICING_MODES, PRICING_LABELS } from "../../constants/pricing";

describe("PRICING_MODES", () => {
  it("has wholesale and retail values", () => {
    expect(PRICING_MODES).toEqual({ WHOLESALE: "wholesale", RETAIL: "retail" });
  });

  it("values are lowercase strings", () => {
    Object.values(PRICING_MODES).forEach((v) => {
      expect(v).toMatch(/^[a-z]+$/);
    });
  });
});

describe("PRICING_LABELS", () => {
  it("maps each pricing mode to a Spanish label", () => {
    expect(PRICING_LABELS.wholesale).toBe("Mayoreo");
    expect(PRICING_LABELS.retail).toBe("Menudeo");
  });

  it("has a label for every mode value", () => {
    Object.values(PRICING_MODES).forEach((mode) => {
      expect(PRICING_LABELS[mode]).toBeDefined();
    });
  });
});
