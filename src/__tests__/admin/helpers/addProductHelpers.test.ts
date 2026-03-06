import { describe, it, expect } from "vitest";
import { validateRows, isRowValid } from "../../../app/(admin)/admin/add-product/helpers";

const completeRow = {
  name: "Tornillo",
  code: "T001",
  description: "Tornillo de acero",
  measureValue: "10",
  measureId: "m1",
};

describe("validateRows", () => {
  it("returns true with complete rows", () => {
    expect(validateRows([completeRow])).toBe(true);
  });

  it("returns true with multiple complete rows", () => {
    expect(validateRows([completeRow, { ...completeRow, code: "T002" }])).toBe(true);
  });

  it("returns false when name is missing", () => {
    expect(validateRows([{ ...completeRow, name: "" }])).toBe(false);
  });

  it("returns false when code is missing", () => {
    expect(validateRows([{ ...completeRow, code: "" }])).toBe(false);
  });

  it("returns false when description is missing", () => {
    expect(validateRows([{ ...completeRow, description: "" }])).toBe(false);
  });

  it("returns false when measureValue is missing", () => {
    expect(validateRows([{ ...completeRow, measureValue: "" }])).toBe(false);
  });

  it("returns false when measureId is missing", () => {
    expect(validateRows([{ ...completeRow, measureId: "" }])).toBe(false);
  });

  it("returns true for empty array", () => {
    expect(validateRows([])).toBe(true);
  });

  it("returns false if any row in a set is incomplete", () => {
    expect(validateRows([completeRow, { ...completeRow, name: "" }])).toBe(false);
  });
});

describe("isRowValid", () => {
  it("returns true for a complete row", () => {
    expect(isRowValid(completeRow)).toBeTruthy();
  });

  it("returns falsy for an incomplete row", () => {
    expect(isRowValid({ ...completeRow, code: "" })).toBeFalsy();
  });
});
