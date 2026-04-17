import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { PricingProvider } from "../../context/pricing/PricingProvider";

const mockClearOrder = vi.fn();
let mockOrderItems: unknown[] = [];

vi.mock("../../context/order/useOrderContext", () => ({
  useOrderContext: () => ({
    orderItems: mockOrderItems,
    clearOrder: mockClearOrder,
  }),
}));

import usePricingSwitch from "../../hooks/usePricingSwitch";

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <PricingProvider>{children}</PricingProvider>
);

beforeEach(() => {
  vi.clearAllMocks();
  mockOrderItems = [];
  localStorage.clear();
});

describe("usePricingSwitch", () => {
  it("returns current pricingMode", () => {
    const { result } = renderHook(() => usePricingSwitch(), { wrapper });
    expect(result.current.pricingMode).toBe("retail");
  });

  it("confirmOpen is false initially", () => {
    const { result } = renderHook(() => usePricingSwitch(), { wrapper });
    expect(result.current.confirmOpen).toBe(false);
  });

  it("requestSwitch with empty cart switches immediately", () => {
    mockOrderItems = [];
    const { result } = renderHook(() => usePricingSwitch(), { wrapper });

    act(() => {
      result.current.requestSwitch("wholesale");
    });

    expect(result.current.pricingMode).toBe("wholesale");
    expect(result.current.confirmOpen).toBe(false);
  });

  it("requestSwitch with items in cart opens confirmation", () => {
    mockOrderItems = [{ id: 1 }];
    const { result } = renderHook(() => usePricingSwitch(), { wrapper });

    act(() => {
      result.current.requestSwitch("wholesale");
    });

    expect(result.current.confirmOpen).toBe(true);
    expect(result.current.pricingMode).toBe("retail");
  });

  it("confirmSwitch clears cart and switches mode", () => {
    mockOrderItems = [{ id: 1 }];
    const { result } = renderHook(() => usePricingSwitch(), { wrapper });

    act(() => {
      result.current.requestSwitch("wholesale");
    });

    act(() => {
      result.current.confirmSwitch();
    });

    expect(mockClearOrder).toHaveBeenCalled();
    expect(result.current.pricingMode).toBe("wholesale");
    expect(result.current.confirmOpen).toBe(false);
  });

  it("cancelSwitch closes dialog without changing mode", () => {
    mockOrderItems = [{ id: 1 }];
    const { result } = renderHook(() => usePricingSwitch(), { wrapper });

    act(() => {
      result.current.requestSwitch("wholesale");
    });

    act(() => {
      result.current.cancelSwitch();
    });

    expect(result.current.confirmOpen).toBe(false);
    expect(result.current.pricingMode).toBe("retail");
  });
});
