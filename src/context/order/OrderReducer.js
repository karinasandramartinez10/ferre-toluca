import { OrderTypes } from "./OrderTypes";

export const initialOrderState = {
  orderItems: [],
};

export const orderReducer = (state, action) => {
  switch (action.type) {
    case OrderTypes.loadFromLocalStorage: {
      return {
        ...state,
        orderItems: action.payload,
      };
    }
    case OrderTypes.add: {
      const { product, quantity } = action.payload;
      const existingItemIndex = state.orderItems.findIndex(
        (item) => item.product.id === product.id
      );

      if (existingItemIndex !== -1) {
        const updatedOrderItems = [...state.orderItems];
        updatedOrderItems[existingItemIndex] = {
          ...updatedOrderItems[existingItemIndex],
          quantity: updatedOrderItems[existingItemIndex].quantity + quantity,
        };
        return {
          ...state,
          orderItems: updatedOrderItems,
        };
      }

      return {
        ...state,
        orderItems: [
          ...state.orderItems,
          { product, quantity: Number(quantity) },
        ],
      };
    }

    case OrderTypes.remove: {
      return {
        ...state,
        orderItems: state.orderItems.filter(
          (item) => item.product.id !== action.payload.productId
        ),
      };
    }

    case OrderTypes.clear: {
      return initialOrderState;
    }

    case OrderTypes.update: {
      const { productId, quantity } = action.payload;
      const existingItemIndex = state.orderItems.findIndex(
        (item) => item.product.id === productId
      );

      if (existingItemIndex !== -1) {
        const updatedOrderItems = [...state.orderItems];
        updatedOrderItems[existingItemIndex] = {
          ...updatedOrderItems[existingItemIndex],
          quantity: Number(quantity),
        };
        return {
          ...state,
          orderItems: updatedOrderItems,
        };
      }

      return state;
    }

    default:
      return state;
  }
};
