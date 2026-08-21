import { describe, it, expect } from "vitest";
import { SignUpSchema } from "../../schemas/auth/signup";

const validData = {
  companyName: null,
  name: "Juan",
  lastname: "Perez",
  email: "juan@example.com",
  dateOfBirth: "1990-01-15",
  password: "Secret1234",
  confirmPassword: "Secret1234",
  phoneNumber: "+525551234567",
  agreeTerms: true,
};

describe("SignUpSchema", () => {
  it("accepts valid data", async () => {
    await expect(SignUpSchema.isValid(validData)).resolves.toBe(true);
  });

  it("accepts null companyName", async () => {
    await expect(SignUpSchema.isValid({ ...validData, companyName: null })).resolves.toBe(true);
  });

  it("rejects invalid email", async () => {
    await expect(SignUpSchema.isValid({ ...validData, email: "not-email" })).resolves.toBe(false);
  });

  it("rejects missing name", async () => {
    await expect(SignUpSchema.isValid({ ...validData, name: "" })).resolves.toBe(false);
  });

  it("rejects short password", async () => {
    const data = { ...validData, password: "Ab1", confirmPassword: "Ab1" };
    await expect(SignUpSchema.isValid(data)).resolves.toBe(false);
  });

  it("rejects password without uppercase", async () => {
    const data = { ...validData, password: "secret1234", confirmPassword: "secret1234" };
    await expect(SignUpSchema.isValid(data)).resolves.toBe(false);
  });

  it("rejects mismatched confirmPassword", async () => {
    await expect(
      SignUpSchema.isValid({ ...validData, confirmPassword: "Different1" })
    ).resolves.toBe(false);
  });

  it("rejects underage dateOfBirth", async () => {
    const thisYear = new Date().getFullYear();
    const underageDate = `${thisYear - 10}-06-15`;
    await expect(SignUpSchema.isValid({ ...validData, dateOfBirth: underageDate })).resolves.toBe(
      false
    );
  });

  it("accepts a valid Mexican phone number", async () => {
    await expect(
      SignUpSchema.isValid({ ...validData, phoneNumber: "+525512345678" })
    ).resolves.toBe(true);
  });

  it.each([
    ["local number without country code", "12345"],
    ["valid foreign number (France)", "+33123456789"],
    ["valid foreign number (US)", "+12125551234"],
    ["too few national digits for MX", "+52123456789"],
    ["legacy 1-prefixed mobile, retired in 2019", "+5215551234567"],
    ["too many national digits for MX", "+52155123456789"],
    ["empty string", ""],
    ["only the calling code left by forceCallingCode", "+52"],
    ["null", null],
  ])("rejects invalid phone number: %s", async (_label, phoneNumber) => {
    await expect(SignUpSchema.isValid({ ...validData, phoneNumber })).resolves.toBe(false);
  });

  it.each([
    ["empty string", ""],
    ["only the calling code", "+52"],
  ])("reports only the required message for an empty phone: %s", async (_label, phoneNumber) => {
    const errors = await SignUpSchema.validateAt(
      "phoneNumber",
      { ...validData, phoneNumber },
      { abortEarly: false }
    ).then(
      () => [],
      (err) => err.errors
    );
    expect(errors).toEqual(["El teléfono es requerido"]);
  });

  it("rejects agreeTerms false", async () => {
    await expect(SignUpSchema.isValid({ ...validData, agreeTerms: false })).resolves.toBe(false);
  });
});
