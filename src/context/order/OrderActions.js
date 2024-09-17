"use client"

export const saveOrderToLocalStorage = (orderItems) => {
  if (orderItems.length === 0) {
    localStorage.removeItem("orderItems");
  } else {
    localStorage.setItem("orderItems", JSON.stringify(orderItems));
  }
};


export const loadOrderFromLocalStorage = () => {
  const savedItems = localStorage.getItem("orderItems");
  return savedItems ? JSON.parse(savedItems) : [];
};
