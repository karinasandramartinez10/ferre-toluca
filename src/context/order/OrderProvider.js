"use client";

import { useEffect, useState, useMemo, useReducer } from "react";
import OrderContext from "./OrderContext";
import {
  loadOrderFromLocalStorage,
  saveOrderToLocalStorage,
} from "./OrderActions";
import { initialOrderState, orderReducer } from "./OrderReducer";
import { OrderTypes } from "./OrderTypes";

export const OrderProvider = ({ children }) => {
  const [state, dispatch] = useReducer(orderReducer, initialOrderState);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("✅ OrderProvider montado en producción");
    if (typeof window !== "undefined") {
      const localData = loadOrderFromLocalStorage();
      console.log("🛒 Cargando orden desde localStorage:", localData);
      if (localData && localData.length > 0) {
        dispatch({ type: OrderTypes.loadFromLocalStorage, payload: localData });
      }
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!loading) {
      saveOrderToLocalStorage(state.orderItems);
    }
  }, [state.orderItems, loading]);

  const addToOrder = (product, quantity) => {
    dispatch({
      type: OrderTypes.add,
      payload: { product, quantity },
    });
  };

  const removeFromOrder = (productId) => {
    dispatch({
      type: OrderTypes.remove,
      payload: {
        productId,
      },
    });
  };

  const updateQuantity = (productId, quantity) => {
    dispatch({
      type: OrderTypes.update,
      payload: {
        productId,
        quantity,
      },
    });
  };

  const clearOrder = () => {
    dispatch({ type: OrderTypes.clear });
  };

  const totalItems = useMemo(
    () => state.orderItems.reduce((total, item) => total + item.quantity, 0),
    [state.orderItems]
  );

  if (loading) {
    return;
  }

  return (
    <OrderContext.Provider
      value={{
        orderItems: state.orderItems,
        addToOrder,
        removeFromOrder,
        updateQuantity,
        clearOrder,
        totalItems,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};
