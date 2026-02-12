import { describe, it, expect } from "vitest";
import { getApiErrorMessage } from "../../utils/apiError";

describe("getApiErrorMessage", () => {
  it("extracts message from response.data.message", () => {
    const error = { response: { data: { message: "Not found" } } };
    expect(getApiErrorMessage(error)).toBe("Not found");
  });

  it("falls back to error.message", () => {
    const error = { message: "Network error" };
    expect(getApiErrorMessage(error)).toBe("Network error");
  });

  it('returns "Error desconocido" when no message', () => {
    expect(getApiErrorMessage({})).toBe("Error desconocido");
  });

  it('returns "Error desconocido" for null/undefined', () => {
    expect(getApiErrorMessage(null)).toBe("Error desconocido");
    expect(getApiErrorMessage(undefined)).toBe("Error desconocido");
  });

  it("ignores empty string messages", () => {
    const error = { response: { data: { message: "   " } } };
    expect(getApiErrorMessage(error)).toBe("Error desconocido");
  });

  it("prefers response.data.message over error.message", () => {
    const error = {
      message: "Generic",
      response: { data: { message: "Specific" } },
    };
    expect(getApiErrorMessage(error)).toBe("Specific");
  });
});
