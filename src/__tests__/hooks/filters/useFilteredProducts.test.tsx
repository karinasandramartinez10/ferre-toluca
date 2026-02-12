import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { createQueryWrapper } from "../../../test/createQueryWrapper";

const mockGetFilteredProducts = vi.fn();

vi.mock("../../../api/products", () => ({
  getFilteredProducts: (...args: unknown[]) => mockGetFilteredProducts(...args),
}));

import useFilteredProducts from "../../../hooks/filters/useFilteredProducts";

beforeEach(() => {
  vi.clearAllMocks();
  mockGetFilteredProducts.mockResolvedValue({
    products: [{ id: 1, name: "Producto A" }],
    count: 1,
    totalPages: 1,
  });
});

describe("useFilteredProducts", () => {
  it("fetches products with default params", async () => {
    const { wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useFilteredProducts(), { wrapper });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.products).toHaveLength(1);
    expect(result.current.count).toBe(1);
    expect(result.current.totalPages).toBe(1);
    expect(result.current.currentPage).toBe(1);
  });

  it("passes filters to the API", async () => {
    const filters = { brandIds: [1, 2], q: "martillo" };
    const { wrapper } = createQueryWrapper();

    renderHook(() => useFilteredProducts(filters, 20), { wrapper });

    await waitFor(() => {
      expect(mockGetFilteredProducts).toHaveBeenCalledWith(
        expect.objectContaining({
          brandIds: [1, 2],
          q: "martillo",
          page: 1,
          size: 20,
        })
      );
    });
  });

  it("supports pagination via setCurrentPage", async () => {
    mockGetFilteredProducts.mockResolvedValue({
      products: [{ id: 2, name: "Producto B" }],
      count: 20,
      totalPages: 2,
    });

    const { wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useFilteredProducts({}, 10), {
      wrapper,
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => {
      result.current.setCurrentPage(2);
    });

    await waitFor(() => {
      expect(mockGetFilteredProducts).toHaveBeenCalledWith(expect.objectContaining({ page: 2 }));
    });
  });

  it("resets page to 1 when filters change", async () => {
    const { wrapper } = createQueryWrapper();
    const { result, rerender } = renderHook(({ filters }) => useFilteredProducts(filters, 10), {
      wrapper,
      initialProps: { filters: { brandIds: [1] } },
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    // Go to page 2
    act(() => {
      result.current.setCurrentPage(2);
    });

    expect(result.current.currentPage).toBe(2);

    // Change filters — should reset to page 1
    rerender({ filters: { brandIds: [1, 2] } });

    await waitFor(() => expect(result.current.currentPage).toBe(1));
  });

  it("returns empty arrays on error-free empty response", async () => {
    mockGetFilteredProducts.mockResolvedValue(undefined);

    const { wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useFilteredProducts(), { wrapper });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.products).toEqual([]);
    expect(result.current.count).toBe(0);
    expect(result.current.totalPages).toBe(0);
  });
});
