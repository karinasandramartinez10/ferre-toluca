import { useContext } from "react";
import OrderContext from "../../context/order/OrderContext";

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("❌ useOrder debe ser usado dentro de un OrderProvider");
  }
  return context;
};
