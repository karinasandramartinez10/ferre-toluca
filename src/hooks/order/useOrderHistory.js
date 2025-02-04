import { useEffect, useState } from "react";
import { fetchOrderHistory } from "../../api/quote";

export const useOrderHistory = (size = 5) => {
  const [orders, setOrders] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getOrderHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchOrderHistory(currentPage, size);
      setOrders(response.data.data.orders);
      setTotalPages(response.data.data.totalPages);
    } catch (err) {
      setError("Error al obtener el historial de órdenes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getOrderHistory();
  }, [currentPage, size]);

  return { orders, totalPages, currentPage, setCurrentPage, loading, error };
};
