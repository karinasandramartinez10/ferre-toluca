import * as yup from "yup";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { TEL_COUNTRY } from "../constants/tel";

const INVALID_TEL = "El teléfono no es válido";

const isValidTel = (value) => {
  if (!value) return true;
  const parsed = parsePhoneNumberFromString(value);
  return Boolean(parsed) && parsed.country === TEL_COUNTRY && parsed.isValid();
};

export const requiredTel = () =>
  yup
    .string()
    .nullable()
    .required("El teléfono es requerido")
    .test("is-valid-tel", INVALID_TEL, isValidTel);

export const optionalTel = () =>
  yup
    .string()
    .nullable()
    .transform((value) => (value === "" ? null : value))
    .test("is-valid-tel", INVALID_TEL, isValidTel);
