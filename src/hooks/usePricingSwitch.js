import { useState, useCallback } from "react";
import { usePricingMode } from "../context/pricing/usePricingMode";
import { useOrderContext } from "../context/order/useOrderContext";

/**
 * Hook que encapsula la lógica de cambio de pricing mode con confirmación de vaciado de carrito.
 */
export default function usePricingSwitch() {
  const { pricingMode, setPricingMode } = usePricingMode();
  const { orderItems, clearOrder } = useOrderContext();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingMode, setPendingMode] = useState(null);

  const requestSwitch = useCallback(
    (newMode) => {
      if (orderItems.length > 0) {
        setPendingMode(newMode);
        setConfirmOpen(true);
      } else {
        setPricingMode(newMode);
      }
    },
    [orderItems.length, setPricingMode]
  );

  const confirmSwitch = useCallback(() => {
    clearOrder();
    setPricingMode(pendingMode);
    setConfirmOpen(false);
    setPendingMode(null);
  }, [clearOrder, setPricingMode, pendingMode]);

  const cancelSwitch = useCallback(() => {
    setConfirmOpen(false);
    setPendingMode(null);
  }, []);

  return {
    pricingMode,
    confirmOpen,
    requestSwitch,
    confirmSwitch,
    cancelSwitch,
  };
}
