import * as yup from "yup";

// RFC Personas Morales/ Físicas (simplificado SAT): 3-4 letras + 6 dígitos + 3 alfanum
// Fuente sugerida del usuario; forzamos mayúsculas
const RFC_REGEX = /^[A-Z&Ñ]{3,4}\d{6}[A-Z0-9]{3}$/;

export const FiscalProfileSchema = yup
  .object({
    fiscalName: yup
      .string()
      .trim()
      .min(3, "La razón social debe tener al menos 3 caracteres")
      .required("La razón social es requerida"),
    rfc: yup
      .string()
      .transform((v) => (v ? v.toUpperCase() : v))
      .matches(RFC_REGEX, "RFC inválido")
      .required("El RFC es requerido"),
    taxZipCode: yup
      .string()
      .matches(/^\d{5}$/, "El CP debe tener 5 dígitos")
      .required("El código postal es requerido"),
    taxRegimeId: yup.number().nullable(),
    taxRegimeCode: yup.string().nullable(),
    defaultCfdiUseId: yup.number().nullable(),
    cfdiUseCode: yup
      .string()
      .transform((v) => (v ? String(v).toUpperCase() : v))
      .nullable(),
    isDefault: yup.boolean().nullable(),
  })
  .test("tax-regime-required", function (value) {
    const hasRegime = Boolean(value?.taxRegimeId || value?.taxRegimeCode);
    if (hasRegime) return true;
    return this.createError({ path: "taxRegimeId", message: "Debe seleccionar un régimen fiscal" });
  })
  .test(
    "tax-regime-xor",
    "Envíe solo uno: TaxRegimeId o taxRegimeCode",
    (value) => {
      const hasId = Boolean(value?.taxRegimeId);
      const hasCode = Boolean(value?.taxRegimeCode);
      return !(hasId && hasCode);
    }
  );

export default FiscalProfileSchema;
