"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import PricingContext from "./PricingContext";

const STORAGE_KEY = "ferre-pricing-mode";

export const PricingProvider = ({ children }) => {
  // Always start with "retail" to avoid SSR hydration mismatch.
  // localStorage is synced on mount via useEffect.
  const [pricingMode, setPricingModeState] = useState("retail");
  const [hydrated, setHydrated] = useState(false);

  // Sync from localStorage on client mount (runs once)
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "wholesale" || stored === "retail") {
        setPricingModeState(stored);
      }
    } catch {}
    setHydrated(true);
  }, []);

  // Persist to localStorage on changes (skip first render to avoid overwriting)
  useEffect(() => {
    if (hydrated) {
      try {
        localStorage.setItem(STORAGE_KEY, pricingMode);
      } catch {}
    }
  }, [pricingMode, hydrated]);

  const setPricingMode = useCallback((mode) => {
    setPricingModeState(mode);
  }, []);

  const isWholesale = pricingMode === "wholesale";

  const value = useMemo(
    () => ({ pricingMode, setPricingMode, isWholesale }),
    [pricingMode, setPricingMode, isWholesale]
  );

  return <PricingContext.Provider value={value}>{children}</PricingContext.Provider>;
};
