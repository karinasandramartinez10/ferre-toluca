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
  phoneNumber: "+5215551234567",
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

  it("rejects invalid phone number", async () => {
    await expect(SignUpSchema.isValid({ ...validData, phoneNumber: "12345" })).resolves.toBe(false);
  });

  it("rejects agreeTerms false", async () => {
    await expect(SignUpSchema.isValid({ ...validData, agreeTerms: false })).resolves.toBe(false);
  });
});
