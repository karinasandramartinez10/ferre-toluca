import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { createQueryWrapper } from "../../../createQueryWrapper";

const mockGetTaxRegimes = vi.fn();
const mockGetCfdiUses = vi.fn();

vi.mock("../../../../api/taxRegimes", () => ({
  getTaxRegimes: (...args: unknown[]) => mockGetTaxRegimes(...args),
}));

vi.mock("../../../../api/cfdiUses", () => ({
  getCfdiUses: (...args: unknown[]) => mockGetCfdiUses(...args),
}));

import { useFiscalCatalogs } from "../../../../hooks/user/fiscal/useFiscalCatalogs";

const regimes = [{ id: 1, code: "612", description: "Personas Físicas" }];
const cfdiUses = [{ id: 1, code: "G03", description: "Gastos en general" }];

beforeEach(() => {
  vi.clearAllMocks();
  mockGetTaxRegimes.mockResolvedValue(regimes);
  mockGetCfdiUses.mockResolvedValue(cfdiUses);
});

describe("useFiscalCatalogs", () => {
  it("fetches tax regimes and CFDI uses in parallel", async () => {
    const { wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useFiscalCatalogs(), { wrapper });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.taxRegimes).toEqual(regimes);
    expect(result.current.cfdiUses).toEqual(cfdiUses);
    expect(result.current.error).toBeNull();
  });

  it("returns empty arrays while loading", () => {
    const { wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useFiscalCatalogs(), { wrapper });

    expect(result.current.taxRegimes).toEqual([]);
    expect(result.current.cfdiUses).toEqual([]);
    expect(result.current.loading).toBe(true);
  });

  it("exposes error message on failure", async () => {
    mockGetTaxRegimes.mockRejectedValue(new Error("Fetch failed"));

    const { wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useFiscalCatalogs(), { wrapper });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBe("Fetch failed");
    expect(result.current.taxRegimes).toEqual([]);
    expect(result.current.cfdiUses).toEqual([]);
  });
});
