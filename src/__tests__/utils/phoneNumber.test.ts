import { describe, it, expect } from "vitest";
import { formatPhoneNumber } from "../../utils/phoneNumber";

describe("formatPhoneNumber", () => {
  it.each([
    ["E.164 mexicano", "+525512345678"],
    ["10 dígitos nacionales, sin lada país", "5512345678"],
    ["nacional ya espaciado", "55 1234 5678"],
  ])("formatea un teléfono mexicano: %s", (_label, stored) => {
    expect(formatPhoneNumber(stored)).toBe("55 1234 5678");
  });

  it("conserva la lada país en un número extranjero", () => {
    expect(formatPhoneNumber("+33123456789")).toBe("+33 1 23 45 67 89");
  });

  it.each([
    ["móvil legacy con el 1 retirado en 2019", "+5215551234567"],
    ["basura corta", "1234"],
  ])("devuelve el valor guardado cuando no es formateable: %s", (_label, stored) => {
    expect(formatPhoneNumber(stored)).toBe(stored);
  });

  it.each([
    ["null", null],
    ["undefined", undefined],
    ["cadena vacía", ""],
    ["número", 5512345678],
  ])("devuelve cadena vacía sin inventar dígitos: %s", (_label, stored) => {
    expect(formatPhoneNumber(stored)).toBe("");
  });
});
