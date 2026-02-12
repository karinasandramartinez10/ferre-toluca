import { describe, it, expect } from "vitest";
import { formatPhoneNumber } from "../../utils/phoneNumber";

describe("formatPhoneNumber", () => {
  it("formats a 10-digit string through numeral", () => {
    const result = formatPhoneNumber("5512345678");
    expect(typeof result).toBe("string");
    expect(result).toContain("5512345678");
  });

  it("formats a numeric input through numeral", () => {
    const result = formatPhoneNumber(5512345678);
    expect(typeof result).toBe("string");
    expect(result).toContain("5512345678");
  });
});
