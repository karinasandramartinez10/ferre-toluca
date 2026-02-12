import { describe, it, expect } from "vitest";
import { getDefaultFiscalProfile, buildFiscalSecondaryText } from "../../utils/fiscal";

describe("getDefaultFiscalProfile", () => {
  it("returns the default profile", () => {
    const profiles = [
      { id: 1, isDefault: false },
      { id: 2, isDefault: true },
    ];
    expect(getDefaultFiscalProfile(profiles)).toEqual({
      id: 2,
      isDefault: true,
    });
  });

  it("returns the first profile when no default exists", () => {
    const profiles = [
      { id: 1, isDefault: false },
      { id: 2, isDefault: false },
    ];
    expect(getDefaultFiscalProfile(profiles)).toEqual({
      id: 1,
      isDefault: false,
    });
  });

  it("returns null for empty array", () => {
    expect(getDefaultFiscalProfile([])).toBeNull();
  });

  it("returns null for non-array", () => {
    expect(getDefaultFiscalProfile(null as unknown as [])).toBeNull();
    expect(getDefaultFiscalProfile(undefined as unknown as [])).toBeNull();
  });
});

describe("buildFiscalSecondaryText", () => {
  it("builds full text with CFDI and regime", () => {
    const profile = {
      defaultCfdiUse: { code: "G03", description: "Gastos en general" },
      TaxRegime: { code: "612", description: "Personas Físicas" },
    };
    expect(buildFiscalSecondaryText(profile)).toBe(
      "CFDI: G03 - Gastos en general · Régimen: 612 - Personas Físicas"
    );
  });

  it("builds text with only CFDI", () => {
    const profile = {
      defaultCfdiUse: { code: "G03", description: "Gastos" },
    };
    expect(buildFiscalSecondaryText(profile)).toBe("CFDI: G03 - Gastos");
  });

  it("builds text with only regime (lowercase taxRegime key)", () => {
    const profile = {
      taxRegime: { code: "612", description: "Personas" },
    };
    expect(buildFiscalSecondaryText(profile)).toBe("Régimen: 612 - Personas");
  });

  it("handles CFDI code without description", () => {
    const profile = {
      defaultCfdiUse: { code: "G03" },
    };
    expect(buildFiscalSecondaryText(profile)).toBe("CFDI: G03");
  });

  it("returns empty string for null/undefined", () => {
    expect(buildFiscalSecondaryText(null)).toBe("");
    expect(buildFiscalSecondaryText(undefined)).toBe("");
  });

  it("returns empty string for empty profile", () => {
    expect(buildFiscalSecondaryText({})).toBe("");
  });
});
