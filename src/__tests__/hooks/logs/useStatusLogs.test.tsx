import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { createQueryWrapper } from "../../../test/createQueryWrapper";

const mockFetchStatusLogs = vi.fn();
const mockPostStatusLog = vi.fn();

vi.mock("../../../api/admin/logs", () => ({
  fetchStatusLogsForQuote: (...args: unknown[]) => mockFetchStatusLogs(...args),
  postStatusLogForQuote: (...args: unknown[]) => mockPostStatusLog(...args),
}));

import { useStatusLogs } from "../../../hooks/logs/useStatusLogs";

beforeEach(() => {
  vi.clearAllMocks();
  mockFetchStatusLogs.mockResolvedValue([{ id: 1, status: "IN_REVIEW", createdAt: "2024-01-01" }]);
  mockPostStatusLog.mockResolvedValue({ id: 2, status: "APPROVED" });
});

describe("useStatusLogs", () => {
  it("fetches logs when quoteId is provided", async () => {
    const { wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useStatusLogs("q1"), { wrapper });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.logs).toHaveLength(1);
    expect(result.current.logs[0].status).toBe("IN_REVIEW");
    expect(mockFetchStatusLogs).toHaveBeenCalledWith("q1");
  });

  it("does not fetch when quoteId is undefined", () => {
    const { wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useStatusLogs(undefined), { wrapper });

    expect(result.current.logs).toEqual([]);
    expect(mockFetchStatusLogs).not.toHaveBeenCalled();
  });

  it("appendLog calls postStatusLogForQuote mutation", async () => {
    const { wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useStatusLogs("q1"), { wrapper });

    await waitFor(() => expect(result.current.loading).toBe(false));

    const entry = { status: "APPROVED", note: "Approved by admin" };

    await act(async () => {
      await result.current.appendLog("q1", entry);
    });

    expect(mockPostStatusLog).toHaveBeenCalledWith("q1", entry);
  });
});
