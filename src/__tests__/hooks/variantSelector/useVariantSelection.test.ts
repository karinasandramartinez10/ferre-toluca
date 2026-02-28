import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";

const mockPush = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

import { useVariantSelection } from "../../../hooks/variantSelector/useVariantSelection";

// ── Helpers to build variant fixtures ──────────────────────────────

const awg = { id: "m1", name: "American Wire Gauge", abbreviation: "awg" };

function cable(id: string, color: string, measureValue: number) {
  return { id, color, measureValue, measure: awg };
}

// 12 cables: 4 colors × 3 calibers
const CABLES = [
  cable("c-8-negro", "negro", 8),
  cable("c-8-blanco", "blanco", 8),
  cable("c-8-verde", "verde", 8),
  cable("c-8-rojo", "rojo", 8),
  cable("c-10-negro", "negro", 10),
  cable("c-10-blanco", "blanco", 10),
  cable("c-10-verde", "verde", 10),
  cable("c-10-rojo", "rojo", 10),
  cable("c-12-negro", "negro", 12),
  cable("c-12-blanco", "blanco", 12),
  cable("c-12-verde", "verde", 12),
  cable("c-12-rojo", "rojo", 12),
];

// ── Helpers for products with primary + secondary measure ──────────

const pulgadas = { id: "m3", name: "Pulgadas", abbreviation: '"' };
const metros = { id: "m4", name: "Metros", abbreviation: "m" };
const mm = { id: "m2", name: "Milímetros", abbreviation: "mm" };

function dualMeasure(id: string, color: string, primaryVal: number, secondaryVal: number) {
  return {
    id,
    color,
    measureValue: primaryVal,
    measure: awg,
    secondaryMeasureValue: secondaryVal,
    secondaryMeasure: mm,
  };
}

const DUAL_VARIANTS = [
  dualMeasure("d-10-5-rojo", "rojo", 10, 5),
  dualMeasure("d-10-5-azul", "azul", 10, 5),
  dualMeasure("d-10-10-rojo", "rojo", 10, 10),
  dualMeasure("d-10-10-azul", "azul", 10, 10),
  dualMeasure("d-12-5-rojo", "rojo", 12, 5),
  dualMeasure("d-12-5-azul", "azul", 12, 5),
];

// ── Tests ──────────────────────────────────────────────────────────

beforeEach(() => {
  vi.clearAllMocks();
});

describe("useVariantSelection", () => {
  // ── Initial state ──────────────────────────────────────────────

  describe("initial state", () => {
    it("selects the initial variant and its color", () => {
      const { result } = renderHook(() => useVariantSelection(CABLES, "c-12-negro"));

      expect(result.current.selectedVariantId).toBe("c-12-negro");
      expect(result.current.selectedColor).toBe("negro");
    });

    it("falls back to the first variant if initialId is not found", () => {
      const { result } = renderHook(() => useVariantSelection(CABLES, "non-existent"));

      expect(result.current.selectedVariantId).toBe("non-existent");
      expect(result.current.selectedColor).toBe("negro"); // first variant's color
    });
  });

  // ── Color options ──────────────────────────────────────────────

  describe("colorOptions", () => {
    it("returns deduplicated colors preserving insertion order", () => {
      const { result } = renderHook(() => useVariantSelection(CABLES, "c-12-negro"));

      expect(result.current.colorOptions).toEqual(["negro", "blanco", "verde", "rojo"]);
    });
  });

  // ── handleColorChange – primary measure preservation ───────────

  describe("handleColorChange", () => {
    it("preserves primary measure when switching color (12 AWG negro → 12 AWG blanco)", () => {
      const { result } = renderHook(() => useVariantSelection(CABLES, "c-12-negro"));

      act(() => result.current.handleColorChange("blanco"));

      expect(mockPush).toHaveBeenCalledWith("/product/c-12-blanco");
    });

    it("preserves primary measure for a different caliber (10 AWG rojo → 10 AWG verde)", () => {
      const { result } = renderHook(() => useVariantSelection(CABLES, "c-10-rojo"));

      act(() => result.current.handleColorChange("verde"));

      expect(mockPush).toHaveBeenCalledWith("/product/c-10-verde");
    });

    it("preserves primary measure (8 AWG blanco → 8 AWG negro)", () => {
      const { result } = renderHook(() => useVariantSelection(CABLES, "c-8-blanco"));

      act(() => result.current.handleColorChange("negro"));

      expect(mockPush).toHaveBeenCalledWith("/product/c-8-negro");
    });

    it("falls back to first variant with that color if no measure match exists", () => {
      const limited = [cable("l-8-negro", "negro", 8), cable("l-10-blanco", "blanco", 10)];

      const { result } = renderHook(() => useVariantSelection(limited, "l-8-negro"));

      // No "8 AWG blanco" exists, so it should pick the first blanco
      act(() => result.current.handleColorChange("blanco"));

      expect(mockPush).toHaveBeenCalledWith("/product/l-10-blanco");
    });
  });

  // ── handleColorChange – primary + secondary measure preservation ─

  describe("handleColorChange with dual measures", () => {
    it("preserves both primary and secondary measure (10 awg / 5 mm rojo → 10 awg / 5 mm azul)", () => {
      const { result } = renderHook(() => useVariantSelection(DUAL_VARIANTS, "d-10-5-rojo"));

      act(() => result.current.handleColorChange("azul"));

      expect(mockPush).toHaveBeenCalledWith("/product/d-10-5-azul");
    });

    it("preserves both measures for a different combination (10 awg / 10 mm rojo → 10 awg / 10 mm azul)", () => {
      const { result } = renderHook(() => useVariantSelection(DUAL_VARIANTS, "d-10-10-rojo"));

      act(() => result.current.handleColorChange("azul"));

      expect(mockPush).toHaveBeenCalledWith("/product/d-10-10-azul");
    });

    it("falls back to primary-only match when exact dual match is missing", () => {
      // Remove d-12-5-azul so there's no exact match for 12/5 azul
      const subset = DUAL_VARIANTS.filter((v) => v.id !== "d-12-5-azul");

      const { result } = renderHook(() => useVariantSelection(subset, "d-12-5-rojo"));

      act(() => result.current.handleColorChange("azul"));

      // No 12 AWG / 5 mm azul → no primary match either (no 12 AWG azul at all) → first azul
      expect(mockPush).toHaveBeenCalledWith("/product/d-10-5-azul");
    });

    it("prefers primary match over first variant when secondary differs", () => {
      // Remove only the exact 12/5 azul, but add a 12/10 azul so primary matches
      const subset = DUAL_VARIANTS.filter((v) => v.id !== "d-12-5-azul");
      subset.push(dualMeasure("d-12-10-azul", "azul", 12, 10));

      const { result } = renderHook(() => useVariantSelection(subset, "d-12-5-rojo"));

      act(() => result.current.handleColorChange("azul"));

      // No exact 12/5 azul, but 12/10 azul matches primary → picks that over first azul (10/5)
      expect(mockPush).toHaveBeenCalledWith("/product/d-12-10-azul");
    });
  });

  // ── handleVariantChange ────────────────────────────────────────

  describe("handleVariantChange", () => {
    it("navigates to the selected variant id", () => {
      const { result } = renderHook(() => useVariantSelection(CABLES, "c-12-negro"));

      act(() => result.current.handleVariantChange("c-8-negro"));

      expect(mockPush).toHaveBeenCalledWith("/product/c-8-negro");
    });
  });

  // ── variantOptions (filtered by color) ─────────────────────────

  describe("variantOptions", () => {
    it("shows only variants of the selected color", () => {
      const { result } = renderHook(() => useVariantSelection(CABLES, "c-12-negro"));

      const ids = result.current.variantOptions.map((o) => o.id);
      expect(ids).toEqual(["c-8-negro", "c-10-negro", "c-12-negro"]);
    });

    it("builds correct labels with measure values", () => {
      const { result } = renderHook(() => useVariantSelection(CABLES, "c-12-negro"));

      const labels = result.current.variantOptions.map((o) => o.label);
      expect(labels).toEqual(["8 awg", "10 awg", "12 awg"]);
    });
  });

  // ── variantLabel ───────────────────────────────────────────────

  describe("variantLabel", () => {
    it("uses the measure name as label when variants have different primaries", () => {
      const { result } = renderHook(() => useVariantSelection(CABLES, "c-12-negro"));

      expect(result.current.variantLabel).toBe("American Wire Gauge");
    });

    it('returns "Variante" when variants only differ by qualifier', () => {
      const qualifierOnly = [
        { id: "q1", color: "negro", qualifier: "Chica" },
        { id: "q2", color: "negro", qualifier: "Grande" },
      ];

      const { result } = renderHook(() => useVariantSelection(qualifierOnly, "q1"));

      expect(result.current.variantLabel).toBe("Variante");
    });
  });

  // ── Real-world product scenarios ─────────────────────────────────

  describe("real-world: Tubo corrugado Poliflex (color + primary + secondary)", () => {
    // 28-12-89-231-0-0 — Tubo corrugado Poliflex (sin guía)
    // 3 variantes naranja: 1"·50m, 3/4"·50m, 3/4"·100m
    // Simulating if they also came in gris
    const POLIFLEX = [
      {
        id: "pf-1-50-naranja",
        color: "naranja",
        measureValue: 1,
        measure: pulgadas,
        secondaryMeasureValue: 50,
        secondaryMeasure: metros,
      },
      {
        id: "pf-34-50-naranja",
        color: "naranja",
        measureValue: 0.75,
        measure: pulgadas,
        secondaryMeasureValue: 50,
        secondaryMeasure: metros,
      },
      {
        id: "pf-34-100-naranja",
        color: "naranja",
        measureValue: 0.75,
        measure: pulgadas,
        secondaryMeasureValue: 100,
        secondaryMeasure: metros,
      },
      {
        id: "pf-1-50-gris",
        color: "gris",
        measureValue: 1,
        measure: pulgadas,
        secondaryMeasureValue: 50,
        secondaryMeasure: metros,
      },
      {
        id: "pf-34-50-gris",
        color: "gris",
        measureValue: 0.75,
        measure: pulgadas,
        secondaryMeasureValue: 50,
        secondaryMeasure: metros,
      },
      {
        id: "pf-34-100-gris",
        color: "gris",
        measureValue: 0.75,
        measure: pulgadas,
        secondaryMeasureValue: 100,
        secondaryMeasure: metros,
      },
    ];

    it('preserves exact measure when switching color (3/4" · 100m naranja → 3/4" · 100m gris)', () => {
      const { result } = renderHook(() => useVariantSelection(POLIFLEX, "pf-34-100-naranja"));

      act(() => result.current.handleColorChange("gris"));

      expect(mockPush).toHaveBeenCalledWith("/product/pf-34-100-gris");
    });

    it('preserves exact measure (1" · 50m naranja → 1" · 50m gris)', () => {
      const { result } = renderHook(() => useVariantSelection(POLIFLEX, "pf-1-50-naranja"));

      act(() => result.current.handleColorChange("gris"));

      expect(mockPush).toHaveBeenCalledWith("/product/pf-1-50-gris");
    });

    it('does not confuse 3/4" · 50m with 3/4" · 100m when switching color', () => {
      const { result } = renderHook(() => useVariantSelection(POLIFLEX, "pf-34-50-naranja"));

      act(() => result.current.handleColorChange("gris"));

      expect(mockPush).toHaveBeenCalledWith("/product/pf-34-50-gris");
    });
  });

  describe("real-world: Caja chalupa Santul (same measures, only color differs)", () => {
    // 38-12-12-432-0-243 — Caja chalupa Santul
    // 2 variantes: 2"·4" Negro, 2"·4" Verde
    const CHALUPA = [
      {
        id: "ch-negro",
        color: "negro",
        measureValue: 2,
        measure: pulgadas,
        secondaryMeasureValue: 4,
        secondaryMeasure: pulgadas,
      },
      {
        id: "ch-verde",
        color: "verde",
        measureValue: 2,
        measure: pulgadas,
        secondaryMeasureValue: 4,
        secondaryMeasure: pulgadas,
      },
    ];

    it("switches directly between colors (negro → verde)", () => {
      const { result } = renderHook(() => useVariantSelection(CHALUPA, "ch-negro"));

      act(() => result.current.handleColorChange("verde"));

      expect(mockPush).toHaveBeenCalledWith("/product/ch-verde");
    });

    it("switches directly between colors (verde → negro)", () => {
      const { result } = renderHook(() => useVariantSelection(CHALUPA, "ch-verde"));

      act(() => result.current.handleColorChange("negro"));

      expect(mockPush).toHaveBeenCalledWith("/product/ch-negro");
    });

    it("shows only one variant option per color (no measure dropdown needed)", () => {
      const { result } = renderHook(() => useVariantSelection(CHALUPA, "ch-negro"));

      expect(result.current.variantOptions).toHaveLength(1);
      expect(result.current.variantOptions[0].id).toBe("ch-negro");
    });
  });

  describe("real-world: Cables KEER THW (color + primary only)", () => {
    // 102-12-16-186-0-0 — Cable KEER THW
    // 12 variantes: 4 colores × 3 calibres (8, 10, 12 AWG)
    // Uses the CABLES fixture defined above

    it("12 AWG negro → click blanco → 12 AWG blanco (not 8 AWG blanco)", () => {
      const { result } = renderHook(() => useVariantSelection(CABLES, "c-12-negro"));

      act(() => result.current.handleColorChange("blanco"));

      expect(mockPush).toHaveBeenCalledWith("/product/c-12-blanco");
      expect(mockPush).not.toHaveBeenCalledWith("/product/c-8-blanco");
    });

    it("10 AWG verde → click rojo → 10 AWG rojo", () => {
      const { result } = renderHook(() => useVariantSelection(CABLES, "c-10-verde"));

      act(() => result.current.handleColorChange("rojo"));

      expect(mockPush).toHaveBeenCalledWith("/product/c-10-rojo");
    });

    it("measure dropdown for negro shows 3 calibers", () => {
      const { result } = renderHook(() => useVariantSelection(CABLES, "c-12-negro"));

      expect(result.current.variantOptions).toHaveLength(3);
      expect(result.current.variantOptions.map((o) => o.label)).toEqual([
        "8 awg",
        "10 awg",
        "12 awg",
      ]);
    });
  });
});
