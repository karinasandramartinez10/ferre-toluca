import { describe, it, expect } from "vitest";
import { trimCategoryName } from "../../helpers/categories";

describe("trimCategoryName", () => {
  it("does not trim short names", () => {
    const result = trimCategoryName("Herramientas");
    expect(result).toEqual({ trimmedName: "Herramientas", isTrimmed: false });
  });

  it("trims names exceeding maxLength", () => {
    const result = trimCategoryName("Pinturas, colorantes y recubrimientos");
    expect(result.isTrimmed).toBe(true);
    expect(result.trimmedName).toBe("Pinturas, colorantes...");
    expect(result.trimmedName).toHaveLength(23); // 20 + "..."
  });

  it("respects custom maxLength", () => {
    const result = trimCategoryName("Herramientas", 5);
    expect(result).toEqual({ trimmedName: "Herra...", isTrimmed: true });
  });

  it("handles exact length (not trimmed)", () => {
    const result = trimCategoryName("12345678901234567890"); // exactly 20
    expect(result.isTrimmed).toBe(false);
  });

  it("handles one over the limit", () => {
    const result = trimCategoryName("123456789012345678901"); // 21 chars
    expect(result.isTrimmed).toBe(true);
  });
});
