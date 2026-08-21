import { describe, it, expect } from "vitest";
import { ContactSchema } from "../../schemas/contact";

const validData = {
  firstName: "Juan",
  lastName: "Perez",
  email: "juan@example.com",
  phoneNumber: "+525512345678",
  companyName: null,
  message: null,
};

describe("ContactSchema", () => {
  it("accepts valid data", async () => {
    await expect(ContactSchema.isValid(validData)).resolves.toBe(true);
  });

  it.each([
    ["empty string", ""],
    ["null", null],
    ["undefined", undefined],
  ])("accepts an omitted phone number: %s", async (_label, phoneNumber) => {
    await expect(ContactSchema.isValid({ ...validData, phoneNumber })).resolves.toBe(true);
  });

  it("casts an empty phone number to null", async () => {
    const value = await ContactSchema.validate({ ...validData, phoneNumber: "" });
    expect(value.phoneNumber).toBeNull();
  });

  it.each([
    ["local number without country code", "12345"],
    ["valid foreign number (France)", "+33123456789"],
    ["valid foreign number (US)", "+12125551234"],
    ["too few national digits for MX", "+52123456789"],
    ["legacy 1-prefixed mobile, retired in 2019", "+5215551234567"],
  ])("rejects invalid phone number: %s", async (_label, phoneNumber) => {
    await expect(ContactSchema.isValid({ ...validData, phoneNumber })).resolves.toBe(false);
  });

  it.each([
    ["firstName", ""],
    ["lastName", ""],
    ["email", ""],
  ])("rejects missing %s", async (field) => {
    await expect(ContactSchema.isValid({ ...validData, [field]: "" })).resolves.toBe(false);
  });

  it("rejects invalid email", async () => {
    await expect(ContactSchema.isValid({ ...validData, email: "not-email" })).resolves.toBe(false);
  });

  it("accepts null companyName and message", async () => {
    await expect(
      ContactSchema.isValid({ ...validData, companyName: null, message: null })
    ).resolves.toBe(true);
  });
});
