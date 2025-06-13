import { useCallback, useEffect, useState } from "react";
import { fetchOrderHistory } from "../../api/quote";
import { format } from "date-fns";

export const useOrderHistory = (size = 10) => {
  const [orders, setOrders] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const [status, setStatus] = useState("IN_REVIEW");
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState(null);
  const [dateTo, setDateTo] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getOrderHistory = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page: currentPage,
        size,
        status,
        search,
      };

      if (dateFrom) {
        // por ej: "2025-06-11"
        params.dateFrom = format(dateFrom, "yyyy-MM-dd");
      }
      if (dateTo) {
        // por ej: "2025-06-13"
        params.dateTo = format(dateTo, "yyyy-MM-dd");
      }

      const response = await fetchOrderHistory(params);
      const {
        data: { orders, totalPages },
      } = response;
      setOrders(orders);
      setTotalPages(totalPages);
    } catch (err) {
      setError("Error al obtener el historial de órdenes");
    } finally {
      setLoading(false);
    }
  }, [currentPage, size, status, search, dateFrom, dateTo]);

  useEffect(() => {
    getOrderHistory();
  }, [getOrderHistory]);

  return {
    orders,
    totalPages,
    currentPage,
    setCurrentPage,
    loading,
    error,

    status,
    setStatus,
    search,
    setSearch,
    dateFrom,
    dateTo,
    setDateFrom,
    setDateTo,
  };
};
