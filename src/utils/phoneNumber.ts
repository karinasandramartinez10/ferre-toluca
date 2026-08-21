import { parsePhoneNumberFromString } from "libphonenumber-js";
import { TEL_COUNTRY } from "../constants/tel";

export const formatPhoneNumber = (phoneNumber: unknown): string => {
  if (typeof phoneNumber !== "string") return "";

  const parsed = parsePhoneNumberFromString(phoneNumber, TEL_COUNTRY);
  if (!parsed?.isValid()) return phoneNumber;

  return parsed.country === TEL_COUNTRY ? parsed.formatNational() : parsed.formatInternational();
};
