import { describe, it, expect } from "vitest";
import { computeLinePricing, computeCartWholesaleGap } from "../../utils/pricing";

const makeItem = (
  id: number,
  quantity: number,
  retailPrice = "100.00",
  wholesalePrice: string | null = "80.00"
) => ({
  product: { id, retailPrice, wholesalePrice },
  quantity,
});

const thresholds = { minTotal: 10, minSameProduct: 5 };

describe("computeLinePricing", () => {
  it("returns retail when no thresholds met", () => {
    const cart = [makeItem(1, 3)];
    const result = computeLinePricing(cart, thresholds);

    expect(result[0].priceType).toBe("retail");
    expect(result[0].unitPrice).toBe("100.00");
  });

  it("returns wholesale when line quantity meets minSameProduct", () => {
    const cart = [makeItem(1, 5)];
    const result = computeLinePricing(cart, thresholds);

    expect(result[0].priceType).toBe("wholesale");
    expect(result[0].unitPrice).toBe("80.00");
  });

  it("returns wholesale for all lines when cart total meets minTotal", () => {
    const cart = [makeItem(1, 6), makeItem(2, 4)];
    const result = computeLinePricing(cart, thresholds);

    expect(result[0].priceType).toBe("wholesale");
    expect(result[1].priceType).toBe("wholesale");
  });

  it("handles mixed scenario: one line qualifies by product, other does not", () => {
    const cart = [makeItem(1, 5), makeItem(2, 3)];
    const result = computeLinePricing(cart, thresholds);

    expect(result[0].priceType).toBe("wholesale");
    expect(result[1].priceType).toBe("retail");
  });

  it("returns retail for products without wholesalePrice even if thresholds met", () => {
    const cart = [makeItem(1, 10, "100.00", null)];
    const result = computeLinePricing(cart, thresholds);

    expect(result[0].priceType).toBe("retail");
    expect(result[0].hasWholesale).toBe(false);
  });

  it("returns retail for products with wholesalePrice of 0", () => {
    const cart = [makeItem(1, 10, "100.00", "0")];
    const result = computeLinePricing(cart, thresholds);

    expect(result[0].priceType).toBe("retail");
    expect(result[0].hasWholesale).toBe(false);
  });

  it("computes missingForLineWholesale correctly", () => {
    const cart = [makeItem(1, 3)];
    const result = computeLinePricing(cart, thresholds);

    expect(result[0].missingForLineWholesale).toBe(2);
  });

  it("missingForLineWholesale is 0 when line qualifies", () => {
    const cart = [makeItem(1, 5)];
    const result = computeLinePricing(cart, thresholds);

    expect(result[0].missingForLineWholesale).toBe(0);
  });

  it("missingForLineWholesale is 0 when product has no wholesale", () => {
    const cart = [makeItem(1, 3, "100.00", null)];
    const result = computeLinePricing(cart, thresholds);

    expect(result[0].missingForLineWholesale).toBe(0);
  });

  it("handles thresholds with 0 values (disabled)", () => {
    const cart = [makeItem(1, 100)];
    const result = computeLinePricing(cart, { minTotal: 0, minSameProduct: 0 });

    expect(result[0].priceType).toBe("retail");
  });

  it("boundary: exact minTotal triggers wholesale", () => {
    const cart = [makeItem(1, 5), makeItem(2, 5)];
    const result = computeLinePricing(cart, thresholds);

    expect(result[0].priceType).toBe("wholesale");
    expect(result[1].priceType).toBe("wholesale");
  });

  it("boundary: exact minSameProduct triggers wholesale", () => {
    const cart = [makeItem(1, 5)];
    const result = computeLinePricing(cart, { minTotal: 100, minSameProduct: 5 });

    expect(result[0].priceType).toBe("wholesale");
  });
});

describe("computeCartWholesaleGap", () => {
  it("returns gap when cart total is below minTotal", () => {
    const cart = [makeItem(1, 3), makeItem(2, 4)];
    expect(computeCartWholesaleGap(cart, thresholds)).toBe(3);
  });

  it("returns 0 when cart total meets minTotal", () => {
    const cart = [makeItem(1, 5), makeItem(2, 5)];
    expect(computeCartWholesaleGap(cart, thresholds)).toBe(0);
  });

  it("returns 0 when minTotal is 0 (disabled)", () => {
    const cart = [makeItem(1, 1)];
    expect(computeCartWholesaleGap(cart, { minTotal: 0, minSameProduct: 5 })).toBe(0);
  });
});
