import { useContext } from "react";
import OrderContext from "../../context/order/OrderContext";

export const useOrder = () => useContext(OrderContext);
