import React from "react";
import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { PricingProvider } from "../../../context/pricing/PricingProvider";
import { usePricingMode } from "../../../context/pricing/usePricingMode";

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <PricingProvider>{children}</PricingProvider>
);

beforeEach(() => {
  localStorage.clear();
});

describe("PricingProvider + usePricingMode", () => {
  it("defaults to retail", () => {
    const { result } = renderHook(() => usePricingMode(), { wrapper });
    expect(result.current.pricingMode).toBe("retail");
  });

  it("setPricingMode changes the mode", () => {
    const { result } = renderHook(() => usePricingMode(), { wrapper });

    act(() => {
      result.current.setPricingMode("wholesale");
    });

    expect(result.current.pricingMode).toBe("wholesale");
  });

  it("persists to localStorage after hydration", async () => {
    const { result } = renderHook(() => usePricingMode(), { wrapper });

    act(() => {
      result.current.setPricingMode("wholesale");
    });

    await waitFor(() => {
      expect(localStorage.getItem("ferre-pricing-mode")).toBe("wholesale");
    });
  });

  it("reads from localStorage on mount", async () => {
    localStorage.setItem("ferre-pricing-mode", "wholesale");

    const { result } = renderHook(() => usePricingMode(), { wrapper });

    await waitFor(() => {
      expect(result.current.pricingMode).toBe("wholesale");
    });
  });

  it("returns isWholesale derived value", () => {
    const { result } = renderHook(() => usePricingMode(), { wrapper });

    expect(result.current.isWholesale).toBe(false);

    act(() => {
      result.current.setPricingMode("wholesale");
    });

    expect(result.current.isWholesale).toBe(true);
  });
});

describe("usePricingMode outside provider", () => {
  it("throws when used outside PricingProvider", () => {
    expect(() => {
      renderHook(() => usePricingMode());
    }).toThrow("usePricingMode debe ser usado dentro de un PricingProvider");
  });
});
