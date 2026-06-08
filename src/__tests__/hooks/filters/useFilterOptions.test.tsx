import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { createQueryWrapper } from "../../createQueryWrapper";

const mockGetFilterOptions = vi.fn();

vi.mock("../../../api/products", () => ({
  getFilterOptions: (...args: unknown[]) => mockGetFilterOptions(...args),
}));

import useFilterOptions from "../../../hooks/filters/useFilterOptions";

const mockOptions = {
  brands: [{ id: 1, name: "Truper", count: 10 }],
  categories: [{ id: 2, name: "Herramientas", count: 5 }],
  subcategories: [],
  types: [],
  models: [],
  measures: [],
  designs: [],
};

beforeEach(() => {
  vi.clearAllMocks();
  mockGetFilterOptions.mockResolvedValue(mockOptions);
});

describe("useFilterOptions", () => {
  it("fetches filter options with default params", async () => {
    const { wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useFilterOptions(), { wrapper });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.options).toEqual(mockOptions);
    expect(result.current.error).toBeNull();
  });

  it("passes current filters to the API", async () => {
    const filters = { brandIds: [1], categoryIds: [2] };
    const { wrapper } = createQueryWrapper();

    renderHook(() => useFilterOptions(filters), { wrapper });

    await waitFor(() => {
      expect(mockGetFilterOptions).toHaveBeenCalledWith(filters);
    });
  });

  it("returns empty options when API returns null", async () => {
    mockGetFilterOptions.mockResolvedValue(null);

    const { wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useFilterOptions(), { wrapper });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.options).toEqual({
      brands: [],
      categories: [],
      subcategories: [],
      types: [],
      models: [],
      measures: [],
      secondaryMeasures: [],
      designs: [],
      qualifiers: [],
    });
  });

  it("exposes error message on failure", async () => {
    mockGetFilterOptions.mockRejectedValue(new Error("Server error"));

    const { wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useFilterOptions(), { wrapper });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBe("Server error");
  });
});
