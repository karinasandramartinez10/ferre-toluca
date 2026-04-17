import { describe, it, expect } from "vitest";
import { parseQuoteError } from "../../app/(main)/checkout/parseQuoteError";

describe("parseQuoteError", () => {
  it("returns unavailable products message with names", () => {
    const error = {
      data: {
        unavailableProducts: [{ name: "Tornillo" }, { name: "Tuerca" }],
      },
    };
    const result = parseQuoteError(error);
    expect(result).toContain("Tornillo");
    expect(result).toContain("Tuerca");
    expect(result).toContain("no disponibles");
  });

  it("returns wholesale missing message", () => {
    const error = {
      data: { productsWithoutWholesale: [10, 24] },
    };
    const result = parseQuoteError(error);
    expect(result).toContain("precio de mayoreo");
  });

  it("returns min quantity message with quantities", () => {
    const error = {
      data: { minQuantity: 10, currentQuantity: 3 },
    };
    const result = parseQuoteError(error);
    expect(result).toContain("10");
    expect(result).toContain("3");
  });

  it("falls back to error.message", () => {
    const error = { message: "Custom error" };
    expect(parseQuoteError(error)).toBe("Custom error");
  });

  it("returns generic message when no data and no message", () => {
    expect(parseQuoteError({})).toBe("Hubo un error al procesar la orden");
  });
});
