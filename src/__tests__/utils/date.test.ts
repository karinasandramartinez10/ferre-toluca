import { describe, it, expect } from "vitest";
import { formatDateDayAbrev } from "../../utils/date";

describe("formatDateDayAbrev", () => {
  it("formats an ISO date string to abbreviated Spanish format", () => {
    const result = formatDateDayAbrev("2024-03-15T10:30:00.000Z");
    expect(result).toBe("15 de mar 24");
  });

  it("formats a January date", () => {
    const result = formatDateDayAbrev("2024-01-01T00:00:00.000Z");
    expect(result).toBe("01 de ene 24");
  });

  it("formats a December date", () => {
    const result = formatDateDayAbrev("2023-12-25T18:00:00.000Z");
    expect(result).toBe("25 de dic 23");
  });
});
