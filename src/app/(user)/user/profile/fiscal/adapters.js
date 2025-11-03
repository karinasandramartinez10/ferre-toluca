// Adapters to isolate backend DTO shape from UI/form.

// dto -> domain
export function adaptFiscalDtoToDomain(dto) {
  if (!dto) return null;
  const taxRegime = dto.taxRegime || dto.TaxRegime || null;
  return {
    id: dto.id ?? null,
    userId: dto.UserId ?? dto.userId ?? null,
    fiscalName: dto.fiscalName ?? "",
    rfc: (dto.rfc ?? "").toUpperCase(),
    taxZipCode: dto.taxZipCode ?? "",
    taxRegimeId: dto.taxRegimeId ?? dto.TaxRegimeId ?? taxRegime?.id ?? null,
    defaultCfdiUseId: dto.defaultCfdiUseId ?? dto.defaultCfdiUse?.id ?? null,
    isDefault: Boolean(dto.isDefault),
    taxRegimeCode: taxRegime?.code ?? "",
    cfdiUseCode: dto.defaultCfdiUse?.code ?? "",
  };
}

// domain -> form defaults
export function adaptFiscalDomainToForm(domain) {
  if (!domain) {
    return {
      fiscalName: "",
      rfc: "",
      taxZipCode: "",
      taxRegimeId: null,
      taxRegimeCode: "",
      defaultCfdiUseId: null,
      cfdiUseCode: "",
    };
  }
  const hasId = domain.taxRegimeId != null;
  return {
    fiscalName: domain.fiscalName,
    rfc: domain.rfc,
    taxZipCode: domain.taxZipCode,
    taxRegimeId: domain.taxRegimeId ?? null,
    // Evitar conflicto XOR en validación: si hay Id, no enviar code
    taxRegimeCode: hasId ? "" : domain.taxRegimeCode ?? "",
    defaultCfdiUseId: domain.defaultCfdiUseId ?? null,
    cfdiUseCode: domain.cfdiUseCode ?? "",
    isDefault: Boolean(domain.isDefault),
  };
}

// form -> payload (PUT)
export function adaptFiscalFormToPayload(formValues) {
  return {
    fiscalName: formValues.fiscalName,
    rfc: (formValues.rfc || "").toUpperCase(),
    taxZipCode: formValues.taxZipCode,
    // Prefer IDs; codes remain optional for future use
    taxRegimeId: formValues.taxRegimeId ?? undefined,
    defaultCfdiUseId: formValues.defaultCfdiUseId ?? undefined,
    isDefault: formValues.isDefault ?? undefined,
  };
}

// list dto[] -> domain[]
export function adaptFiscalListDtoToDomain(list) {
  if (!Array.isArray(list)) return [];
  return list.map(adaptFiscalDtoToDomain);
}

// form -> payload (POST) accept IDs or Codes
export function adaptFiscalCreateFormToPayload(
  formValues,
  { mode = "id" } = {}
) {
  const base = {
    fiscalName: formValues.fiscalName,
    rfc: (formValues.rfc || "").toUpperCase(),
    taxZipCode: formValues.taxZipCode,
    isDefault: Boolean(formValues.isDefault),
  };
  if (mode === "code") {
    return {
      ...base,
      taxRegimeCode: formValues.taxRegimeCode,
      cfdiUseCode: formValues.cfdiUseCode || undefined,
    };
  }
  return {
    ...base,
    TaxRegimeId: formValues.taxRegimeId ?? formValues.TaxRegimeId,
    defaultCfdiUseId: formValues.defaultCfdiUseId ?? null,
  };
}
