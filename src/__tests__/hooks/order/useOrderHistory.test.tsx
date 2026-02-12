import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { createQueryWrapper } from "../../createQueryWrapper";

const mockFetchOrderHistory = vi.fn();

vi.mock("../../../api/quote", () => ({
  fetchOrderHistory: (...args: unknown[]) => mockFetchOrderHistory(...args),
}));

import { useOrderHistory } from "../../../hooks/order/useOrderHistory";

beforeEach(() => {
  vi.clearAllMocks();
  mockFetchOrderHistory.mockResolvedValue({
    data: {
      orders: [{ id: 1, status: "IN_REVIEW" }],
      totalPages: 3,
    },
  });
});

describe("useOrderHistory", () => {
  it("fetches order history with default params", async () => {
    const { wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useOrderHistory(), { wrapper });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.orders).toHaveLength(1);
    expect(result.current.totalPages).toBe(3);
    expect(result.current.currentPage).toBe(1);
    expect(result.current.status).toBe("IN_REVIEW");
  });

  it("supports pagination", async () => {
    const { wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useOrderHistory(10), { wrapper });

    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => {
      result.current.setCurrentPage(2);
    });

    expect(result.current.currentPage).toBe(2);
  });

  it("resets page when status filter changes", async () => {
    const { wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useOrderHistory(), { wrapper });

    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => {
      result.current.setCurrentPage(3);
    });
    expect(result.current.currentPage).toBe(3);

    act(() => {
      result.current.setStatus("COMPLETED");
    });

    await waitFor(() => expect(result.current.currentPage).toBe(1));
  });

  it("resets page when search changes", async () => {
    const { wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useOrderHistory(), { wrapper });

    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => {
      result.current.setCurrentPage(2);
    });

    act(() => {
      result.current.setSearch("12345");
    });

    await waitFor(() => expect(result.current.currentPage).toBe(1));
  });

  it("returns null orders when API returns empty", async () => {
    mockFetchOrderHistory.mockResolvedValue({ data: {} });

    const { wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useOrderHistory(), { wrapper });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.orders).toBeNull();
    expect(result.current.totalPages).toBe(0);
  });
});
