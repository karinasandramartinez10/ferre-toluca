import { describe, it, expect } from "vitest";
import { formatPrice, formatPriceColumn } from "../../utils/currency";

describe("formatPrice", () => {
  it("returns null for null", () => {
    expect(formatPrice(null)).toBeNull();
  });

  it("returns null for undefined", () => {
    expect(formatPrice(undefined)).toBeNull();
  });

  it("returns null for empty string", () => {
    expect(formatPrice("")).toBeNull();
  });

  it("returns null for zero string", () => {
    expect(formatPrice("0")).toBeNull();
    expect(formatPrice("0.00")).toBeNull();
  });

  it("returns null for NaN", () => {
    expect(formatPrice(NaN)).toBeNull();
  });

  it("returns null for non-numeric string", () => {
    expect(formatPrice("abc")).toBeNull();
  });

  it("formats a valid price string", () => {
    const result = formatPrice("150.00");
    expect(result).not.toBeNull();
    expect(result).toContain("150");
  });

  it("formats a number type", () => {
    const result = formatPrice(1234.56);
    expect(result).not.toBeNull();
    expect(result).toContain("1");
    expect(result).toContain("234");
  });
});

describe("formatPriceColumn", () => {
  it("returns dash for null", () => {
    expect(formatPriceColumn(null)).toBe("—");
  });

  it("returns dash for undefined", () => {
    expect(formatPriceColumn(undefined)).toBe("—");
  });

  it("returns dash for NaN", () => {
    expect(formatPriceColumn(NaN)).toBe("—");
  });

  it("formats zero as currency", () => {
    const result = formatPriceColumn(0);
    expect(result).toContain("0.00");
  });

  it("formats zero string as currency", () => {
    const result = formatPriceColumn("0");
    expect(result).toContain("0.00");
  });

  it("formats a valid price", () => {
    const result = formatPriceColumn("1234.56");
    expect(result).not.toBe("—");
    expect(result).toContain("1");
    expect(result).toContain("234");
  });
});
