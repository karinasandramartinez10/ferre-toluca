/**
 * Returns the default fiscal profile from a list, or the first available.
 * If the array is empty or invalid, returns null.
 * @param {Array<object>} profiles
 * @returns {object|null}
 */
export function getDefaultFiscalProfile(profiles) {
  if (!Array.isArray(profiles) || profiles.length === 0) return null;

  return profiles.find((p) => p?.isDefault) || profiles[0] || null;
}

/**
 * Builds a compact secondary string for a fiscal profile combining CFDI and Tax Regime.
 * Example: "CFDI: G03 - Gastos en general · Régimen: 612 - Personas Físicas con Actividades Empresariales"
 */
export function buildFiscalSecondaryText(profile) {
  if (!profile) return "";

  const cfdi = profile?.defaultCfdiUse
    ? `CFDI: ${profile.defaultCfdiUse.code}${
        profile.defaultCfdiUse.description
          ? ` - ${profile.defaultCfdiUse.description}`
          : ""
      }`
    : "";

  const taxRegimeObj = profile?.TaxRegime || profile?.taxRegime;

  const regime = taxRegimeObj
    ? `Régimen: ${taxRegimeObj.code}${
        taxRegimeObj.description ? ` - ${taxRegimeObj.description}` : ""
      }`
    : "";

  return [cfdi, regime].filter(Boolean).join(" · ");
}
