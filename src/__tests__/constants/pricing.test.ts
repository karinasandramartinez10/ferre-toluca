import { describe, it, expect } from "vitest";
import { PRICE_TIERS, TIER_LABELS } from "../../constants/pricing";

describe("PRICE_TIERS", () => {
  it("contains the four tiers A-D in order", () => {
    expect(PRICE_TIERS).toEqual(["A", "B", "C", "D"]);
  });
});

describe("TIER_LABELS", () => {
  it("has a label for every tier", () => {
    PRICE_TIERS.forEach((tier) => {
      expect(TIER_LABELS[tier]).toBeDefined();
      expect(typeof TIER_LABELS[tier]).toBe("string");
    });
  });

  it("labels tier A as the public price", () => {
    expect(TIER_LABELS.A).toBe("Público");
  });
});
