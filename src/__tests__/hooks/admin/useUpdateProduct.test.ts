import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import {
  getProductById,
  updateProduct,
  updateProductPricing,
  updateProductAvailability,
} from "../../../api/products";
import { revalidateProduct } from "../../../actions/revalidate";
import { useUpdateProduct } from "../../../hooks/admin/useUpdateProduct";

vi.mock("../../../api/products", () => ({
  getProductById: vi.fn(),
  updateProduct: vi.fn(),
  updateProductPricing: vi.fn(),
  updateProductAvailability: vi.fn(),
}));

vi.mock("../../../actions/revalidate", () => ({
  revalidateProduct: vi.fn(),
}));

const payload = {
  formData: new FormData(),
  pricing: { priceA: 100 },
  isAvailable: true,
};

describe("useUpdateProduct", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(updateProduct).mockResolvedValue({} as Awaited<ReturnType<typeof updateProduct>>);
    vi.mocked(updateProductPricing).mockResolvedValue({});
    vi.mocked(updateProductAvailability).mockResolvedValue({});
  });

  it("revalida las páginas de todas las variantes del grupo", async () => {
    vi.mocked(getProductById).mockResolvedValue({
      id: 1,
      variants: [{ id: 1 }, { id: 2 }, { id: 3 }],
    });

    const { result } = renderHook(() => useUpdateProduct());
    await act(() => result.current.update("1", payload));

    expect(revalidateProduct).toHaveBeenCalledTimes(1);
    const [id, variantIds] = vi.mocked(revalidateProduct).mock.calls[0];
    expect(id).toBe("1");
    expect(new Set(variantIds)).toEqual(new Set(["1", "2", "3"]));
  });

  it("revalida el grupo anterior y el nuevo si la edición movió el producto", async () => {
    vi.mocked(getProductById)
      .mockResolvedValueOnce({ id: 1, variants: [{ id: 1 }, { id: 2 }] })
      .mockResolvedValueOnce({ id: 1, variants: [{ id: 1 }, { id: 9 }] });

    const { result } = renderHook(() => useUpdateProduct());
    await act(() => result.current.update("1", payload));

    const [, variantIds] = vi.mocked(revalidateProduct).mock.calls[0];
    expect(new Set(variantIds)).toEqual(new Set(["1", "2", "9"]));
  });

  it("lee el grupo anterior antes de enviar el PATCH", async () => {
    vi.mocked(getProductById).mockResolvedValue({ id: 1, variants: [] });

    const { result } = renderHook(() => useUpdateProduct());
    await act(() => result.current.update("1", payload));

    const firstRead = vi.mocked(getProductById).mock.invocationCallOrder[0];
    const patch = vi.mocked(updateProduct).mock.invocationCallOrder[0];
    expect(firstRead).toBeLessThan(patch);
  });

  it("revalida al menos el producto editado si no se pudo leer el grupo", async () => {
    vi.mocked(getProductById).mockResolvedValue({});

    const { result } = renderHook(() => useUpdateProduct());
    await act(() => result.current.update("1", payload));

    expect(revalidateProduct).toHaveBeenCalledWith("1", []);
  });
});
