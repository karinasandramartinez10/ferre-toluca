import { describe, it, expect } from "vitest";
import { getApiErrorMessage, createApiError } from "../../utils/apiError";

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

describe("createApiError", () => {
  it("creates error with message from response", () => {
    const error = { response: { status: 404, data: { message: "Not found" } } };
    const result = createApiError(error);
    expect(result.message).toBe("Not found");
  });

  it("attaches status from response", () => {
    const error = { response: { status: 422, data: {} } };
    const result = createApiError(error);
    expect(result.status).toBe(422);
  });

  it("attaches data from response", () => {
    const error = { response: { status: 400, data: { field: "email", reason: "taken" } } };
    const result = createApiError(error);
    expect(result.data).toEqual({ field: "email", reason: "taken" });
  });

  it("is instance of Error", () => {
    const error = { response: { status: 500, data: { message: "Server error" } } };
    expect(createApiError(error)).toBeInstanceOf(Error);
  });

  it("falls back when no response", () => {
    const result = createApiError({});
    expect(result.message).toBe("Error desconocido");
    expect(result.status).toBeUndefined();
  });
});
