import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { createQueryWrapper } from "../../createQueryWrapper";

const mockGetMeasures = vi.fn();

vi.mock("../../../api/measures", () => ({
  getMeasures: (...args: unknown[]) => mockGetMeasures(...args),
}));

import { useMeasures } from "../../../hooks/catalog/useMeasures";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("useMeasures", () => {
  it("returns measures on successful fetch", async () => {
    const measures = [
      { id: "m1", abbreviation: "kg" },
      { id: "m2", abbreviation: "cm" },
    ];
    mockGetMeasures.mockResolvedValue(measures);

    const { wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useMeasures(), { wrapper });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.measures).toEqual(measures);
    expect(result.current.error).toBeNull();
  });

  it("returns empty array and error message on failure", async () => {
    mockGetMeasures.mockRejectedValue(new Error("Network error"));

    const { wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useMeasures(), { wrapper });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.measures).toEqual([]);
    expect(result.current.error).toBe("Network error");
  });
});
