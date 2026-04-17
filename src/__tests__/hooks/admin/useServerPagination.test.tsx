import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import useServerPagination from "../../../hooks/admin/useServerPagination";

const mockData = {
  items: [
    { id: 1, name: "A", count: 0 },
    { id: 2, name: "B", count: 5 },
  ],
  count: 2,
  totalPages: 1,
};

let mockFetchFn: ReturnType<typeof vi.fn>;

beforeEach(() => {
  vi.clearAllMocks();
  mockFetchFn = vi.fn().mockResolvedValue(mockData);
});

describe("useServerPagination", () => {
  it("calls fetchFn on mount with page 1", async () => {
    renderHook(() => useServerPagination(mockFetchFn));

    await waitFor(() => {
      expect(mockFetchFn).toHaveBeenCalledWith(1, 20);
    });
  });

  it("sets data after successful fetch", async () => {
    const { result } = renderHook(() => useServerPagination(mockFetchFn));

    await waitFor(() => {
      expect(result.current.data).toEqual(mockData);
    });
  });

  it("sets loading false after fetch completes", async () => {
    const { result } = renderHook(() => useServerPagination(mockFetchFn));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });

  it("sets error true on fetch failure", async () => {
    mockFetchFn.mockRejectedValue(new Error("fail"));
    const { result } = renderHook(() => useServerPagination(mockFetchFn));

    await waitFor(() => {
      expect(result.current.error).toBe(true);
    });
  });

  it("pagination change triggers new fetch", async () => {
    const { result } = renderHook(() => useServerPagination(mockFetchFn));

    await waitFor(() => expect(result.current.data).toBeTruthy());

    act(() => {
      result.current.setPaginationModel({ page: 1, pageSize: 20 });
    });

    await waitFor(() => {
      expect(mockFetchFn).toHaveBeenCalledWith(2, 20);
    });
  });

  it("reload re-fetches current page", async () => {
    const { result } = renderHook(() => useServerPagination(mockFetchFn));

    await waitFor(() => expect(result.current.data).toBeTruthy());

    act(() => {
      result.current.reload();
    });

    await waitFor(() => {
      expect(mockFetchFn).toHaveBeenCalledTimes(2);
    });
  });

  it("updateRow updates a row by id with object", async () => {
    const { result } = renderHook(() => useServerPagination(mockFetchFn, { rowsKey: "items" }));

    await waitFor(() => expect(result.current.data).toBeTruthy());

    act(() => {
      result.current.updateRow(1, { name: "Updated" });
    });

    expect(result.current.data.items[0].name).toBe("Updated");
    expect(result.current.data.items[1].name).toBe("B");
  });

  it("updateRow updates a row by id with function", async () => {
    const { result } = renderHook(() => useServerPagination(mockFetchFn, { rowsKey: "items" }));

    await waitFor(() => expect(result.current.data).toBeTruthy());

    act(() => {
      result.current.updateRow(2, (row: (typeof mockData.items)[0]) => ({
        ...row,
        count: row.count + 1,
      }));
    });

    expect(result.current.data.items[1].count).toBe(6);
  });
});
