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

  it("returns missing products message", () => {
    const error = {
      data: { missingProductIds: [10, 24] },
    };
    const result = parseQuoteError(error);
    expect(result).toContain("no fueron encontrados");
  });

  it("falls back to error.message", () => {
    const error = { message: "Custom error" };
    expect(parseQuoteError(error)).toBe("Custom error");
  });

  it("returns generic message when no data and no message", () => {
    expect(parseQuoteError({})).toBe("Hubo un error al procesar la orden");
  });
});
