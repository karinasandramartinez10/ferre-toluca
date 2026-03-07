import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { createQueryWrapper } from "../../createQueryWrapper";

const mockGetProductModels = vi.fn();

vi.mock("../../../api/productModels", () => ({
  getProductModels: (...args: unknown[]) => mockGetProductModels(...args),
}));

import { useProductModels } from "../../../hooks/catalog/useProductModels";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("useProductModels", () => {
  it("returns models when brandId is provided", async () => {
    const models = [{ id: "pm1", name: "Model A" }];
    mockGetProductModels.mockResolvedValue(models);

    const { wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useProductModels("brand-1"), { wrapper });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.productModels).toEqual(models);
    expect(mockGetProductModels).toHaveBeenCalledWith("brand-1");
  });

  it("does not fetch when brandId is falsy", async () => {
    const { wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useProductModels(""), { wrapper });

    // Should stay in initial state — query disabled
    expect(result.current.productModels).toEqual([]);
    expect(mockGetProductModels).not.toHaveBeenCalled();
  });

  it("does not fetch when brandId is null", async () => {
    const { wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useProductModels(null), { wrapper });

    expect(result.current.productModels).toEqual([]);
    expect(mockGetProductModels).not.toHaveBeenCalled();
  });

  it("returns error on failure", async () => {
    mockGetProductModels.mockRejectedValue(new Error("Fetch failed"));

    const { wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useProductModels("brand-1"), { wrapper });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.productModels).toEqual([]);
    expect(result.current.error).toBe("Fetch failed");
  });
});
