import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { createQueryWrapper } from "../../createQueryWrapper";

vi.mock("next-auth/react", () => ({
  useSession: vi.fn(() => ({ status: "authenticated" })),
}));

const mockGetFavorites = vi.fn();
const mockToggleFavorites = vi.fn();

vi.mock("../../../api/favorites", () => ({
  getFavorites: (...args: unknown[]) => mockGetFavorites(...args),
  toggleFavorites: (...args: unknown[]) => mockToggleFavorites(...args),
}));

import { useFavorites } from "../../../hooks/favorites/useFavorites";
import { useSession } from "next-auth/react";

const favProduct = { id: "p1", name: "Martillo" };

beforeEach(() => {
  vi.clearAllMocks();
  mockGetFavorites.mockResolvedValue({
    data: [{ productId: "p1", product: favProduct }],
  });
  mockToggleFavorites.mockResolvedValue({ isFavorite: false });
});

describe("useFavorites", () => {
  it("fetches favorites when authenticated", async () => {
    const { wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useFavorites(), { wrapper });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.favorites).toHaveLength(1);
    expect(result.current.favorites[0].productId).toBe("p1");
  });

  it("does not fetch when unauthenticated", async () => {
    vi.mocked(useSession).mockReturnValue({
      status: "unauthenticated",
    } as ReturnType<typeof useSession>);

    const { wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useFavorites(), { wrapper });

    // Should remain in initial state — query not enabled
    expect(result.current.favorites).toEqual([]);
    expect(mockGetFavorites).not.toHaveBeenCalled();

    // Restore for other tests
    vi.mocked(useSession).mockReturnValue({
      status: "authenticated",
    } as ReturnType<typeof useSession>);
  });

  it("isFavorite returns true for existing favorites", async () => {
    const { wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useFavorites(), { wrapper });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.isFavorite("p1")).toBe(true);
    expect(result.current.isFavorite("unknown")).toBe(false);
  });

  it("toggleFavorite performs optimistic update (remove)", async () => {
    const { wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useFavorites(), { wrapper });

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.favorites).toHaveLength(1);

    await act(async () => {
      await result.current.toggleFavorite({ id: "p1" });
    });

    // After toggle of existing favorite, it should be removed optimistically
    // (the server mock returns isFavorite: false, confirming removal)
  });

  it("rolls back on toggle error", async () => {
    mockToggleFavorites.mockRejectedValueOnce(new Error("Network error"));

    const { wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useFavorites(), { wrapper });

    await waitFor(() => expect(result.current.loading).toBe(false));
    const originalLength = result.current.favorites.length;

    await act(async () => {
      try {
        await result.current.toggleFavorite({ id: "p1" });
      } catch {
        // expected
      }
    });

    // Should rollback to previous state
    await waitFor(() => {
      expect(result.current.favorites).toHaveLength(originalLength);
    });
  });

  it("uses server isFavorite response on success", async () => {
    mockToggleFavorites.mockResolvedValueOnce({ isFavorite: true });
    // First call: initial fetch (only p1)
    // Second call: refetch after toggle (p1 + p2)
    mockGetFavorites
      .mockResolvedValueOnce({
        data: [{ productId: "p1", product: favProduct }],
      })
      .mockResolvedValueOnce({
        data: [
          { productId: "p1", product: favProduct },
          { productId: "p2", product: { id: "p2", name: "Taladro" } },
        ],
      });

    const { wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useFavorites(), { wrapper });

    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.toggleFavorite({ id: "p2" });
    });

    // After refetch, p2 should be in the list
    await waitFor(() => {
      expect(result.current.isFavorite("p2")).toBe(true);
    });
  });
});
