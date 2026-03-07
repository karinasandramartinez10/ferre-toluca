import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { createQueryWrapper } from "../../createQueryWrapper";

const mockGetProductTypes = vi.fn();

vi.mock("../../../api/productTypes", () => ({
  getProductTypes: (...args: unknown[]) => mockGetProductTypes(...args),
}));

import { useProductTypesBySubcategory } from "../../../hooks/catalog/useProductTypesBySubcategory";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("useProductTypesBySubcategory", () => {
  it("returns types when subcategoryId is provided", async () => {
    const types = [{ id: "t1", name: "Type A" }];
    mockGetProductTypes.mockResolvedValue({ productTypes: types });

    const { wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useProductTypesBySubcategory("sc-1"), { wrapper });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.productTypes).toEqual(types);
    expect(mockGetProductTypes).toHaveBeenCalledWith({ subcategoryId: "sc-1" });
  });

  it("does not fetch when subcategoryId is falsy", async () => {
    const { wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useProductTypesBySubcategory(""), { wrapper });

    expect(result.current.productTypes).toEqual([]);
    expect(mockGetProductTypes).not.toHaveBeenCalled();
  });

  it("does not fetch when subcategoryId is null", async () => {
    const { wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useProductTypesBySubcategory(null), { wrapper });

    expect(result.current.productTypes).toEqual([]);
    expect(mockGetProductTypes).not.toHaveBeenCalled();
  });

  it("handles alternative response shape (data.productTypes)", async () => {
    mockGetProductTypes.mockResolvedValue({ data: { productTypes: [{ id: "t2", name: "B" }] } });

    const { wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useProductTypesBySubcategory("sc-1"), { wrapper });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.productTypes).toEqual([{ id: "t2", name: "B" }]);
  });

  it("returns error on failure", async () => {
    mockGetProductTypes.mockRejectedValue(new Error("Server error"));

    const { wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useProductTypesBySubcategory("sc-1"), { wrapper });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.productTypes).toEqual([]);
    expect(result.current.error).toBe("Server error");
  });
});
