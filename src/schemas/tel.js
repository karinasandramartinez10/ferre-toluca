import * as yup from "yup";
import { getCountryCallingCode, parsePhoneNumberFromString } from "libphonenumber-js";
import { TEL_COUNTRY } from "../constants/tel";

const INVALID_TEL = "El teléfono no es válido";

// forceCallingCode deja "+52" en el input cuando el usuario borra lo que escribió,
// así que un campo vacío llega aquí como el prefijo suelto, no como "".
const CALLING_CODE_ONLY = `+${getCountryCallingCode(TEL_COUNTRY)}`;

const emptyToNull = (value) => (value === "" || value === CALLING_CODE_ONLY ? null : value);

const isValidTel = (value) => {
  if (!value) return true;
  const parsed = parsePhoneNumberFromString(value);
  return Boolean(parsed) && parsed.country === TEL_COUNTRY && parsed.isValid();
};

export const requiredTel = yup
  .string()
  .nullable()
  .transform(emptyToNull)
  .required("El teléfono es requerido")
  .test("is-valid-tel", INVALID_TEL, isValidTel);

export const optionalTel = yup
  .string()
  .nullable()
  .transform(emptyToNull)
  .test("is-valid-tel", INVALID_TEL, isValidTel);
