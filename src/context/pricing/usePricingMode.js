import { useContext } from "react";
import PricingContext from "./PricingContext";

export const usePricingMode = () => {
  const context = useContext(PricingContext);
  if (!context) {
    throw new Error("usePricingMode debe ser usado dentro de un PricingProvider");
  }
  return context;
};
