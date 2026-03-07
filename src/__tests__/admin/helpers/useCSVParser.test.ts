import { describe, it, expect, vi } from "vitest";
import { renderHook } from "@testing-library/react";

vi.mock("uuid", () => ({
  v4: vi.fn(() => "test-uuid"),
}));

import { useCSVParser } from "../../../app/(admin)/admin/add-product/useCSVParser";

const measures = [
  { id: "m1", abbreviation: "kg" },
  { id: "m2", abbreviation: "cm" },
];

describe("useCSVParser - transformCSVToRows", () => {
  it("maps CSV columns to row fields correctly", () => {
    const { result } = renderHook(() => useCSVParser());
    const csvData = [
      {
        Nombre: "Tornillo",
        Código: "T001",
        Descripción: "Tornillo de acero",
        Características: "Resistente",
        Valor: "10",
        Unidad: "kg",
        Modelo: "ModeloX",
        Color: "Rojo",
        Cualificador: "Premium",
        Valor2: "5",
        Unidad2: "cm",
      },
    ];

    const { rows, errors } = result.current.transformCSVToRows(csvData, measures);

    expect(errors).toHaveLength(0);
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({
      name: "Tornillo",
      code: "T001",
      description: "Tornillo de acero",
      specifications: "Resistente",
      measureValue: "10",
      measureId: "m1",
      modelName: "ModeloX",
      color: "Rojo",
      qualifier: "Premium",
      secondaryMeasureValue: "5",
      secondaryMeasureId: "m2",
      isNew: true,
    });
  });

  it("resolves abbreviations case-insensitively", () => {
    const { result } = renderHook(() => useCSVParser());
    const csvData = [{ Nombre: "A", Código: "B", Descripción: "C", Valor: "1", Unidad: "KG" }];

    const { rows, errors } = result.current.transformCSVToRows(csvData, measures);

    expect(errors).toHaveLength(0);
    expect(rows[0].measureId).toBe("m1");
  });

  it("produces errors for unrecognized measure abbreviations", () => {
    const { result } = renderHook(() => useCSVParser());
    const csvData = [{ Nombre: "A", Código: "B", Descripción: "C", Valor: "1", Unidad: "xyz" }];

    const { rows, errors } = result.current.transformCSVToRows(csvData, measures);

    expect(errors).toHaveLength(1);
    expect(errors[0]).toEqual({ index: 0, value: "xyz" });
    expect(rows[0].measureId).toBeNull();
  });

  it("returns accepted abbreviations list", () => {
    const { result } = renderHook(() => useCSVParser());
    const { acceptedAbbreviations } = result.current.transformCSVToRows([], measures);

    expect(acceptedAbbreviations).toEqual(["kg", "cm"]);
  });

  it("handles empty CSV data", () => {
    const { result } = renderHook(() => useCSVParser());
    const { rows, errors } = result.current.transformCSVToRows([], measures);

    expect(rows).toHaveLength(0);
    expect(errors).toHaveLength(0);
  });

  it("defaults missing columns to empty strings", () => {
    const { result } = renderHook(() => useCSVParser());
    const csvData = [{ Nombre: "A" }];

    const { rows } = result.current.transformCSVToRows(csvData, measures);

    expect(rows[0].code).toBe("");
    expect(rows[0].description).toBe("");
    expect(rows[0].color).toBe("");
  });

  it("supports Qualifier as alternate column name", () => {
    const { result } = renderHook(() => useCSVParser());
    const csvData = [{ Nombre: "A", Qualifier: "Q1" }];

    const { rows } = result.current.transformCSVToRows(csvData, measures);

    expect(rows[0].qualifier).toBe("Q1");
  });
});
