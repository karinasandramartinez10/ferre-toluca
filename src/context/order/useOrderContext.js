import { useContext } from "react";
import OrderContext from "./OrderContext";

export const useOrderContext = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("❌ useOrder debe ser usado dentro de un OrderProvider");
  }
  return context;
};
