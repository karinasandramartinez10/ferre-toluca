import { useEffect, useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchOrderHistory } from "../../api/quote";
import { queryKeys } from "../../constants/queryKeys";
import { staleTimes } from "../../constants/queryConfig";
import { format } from "date-fns";

export const useOrderHistory = (size = 10) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [status, setStatus] = useState("IN_REVIEW");
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState(null);
  const [dateTo, setDateTo] = useState(null);

  const formattedDateFrom = dateFrom ? format(dateFrom, "yyyy-MM-dd") : "";
  const formattedDateTo = dateTo ? format(dateTo, "yyyy-MM-dd") : "";

  // Reset a página 1 cuando cambian los filtros
  const filtersKey = `${status}-${search}-${formattedDateFrom}-${formattedDateTo}`;
  useEffect(() => {
    setCurrentPage(1);
  }, [filtersKey]);

  const { data, isLoading: loading, error } = useQuery({
    queryKey: queryKeys.orderHistory({
      page: currentPage,
      size,
      status,
      search,
      dateFrom: formattedDateFrom,
      dateTo: formattedDateTo,
    }),
    queryFn: async () => {
      const response = await fetchOrderHistory({
        page: currentPage,
        size,
        status,
        search,
        dateFrom: formattedDateFrom,
        dateTo: formattedDateTo,
      });
      return response.data;
    },
    placeholderData: keepPreviousData,
    staleTime: staleTimes.FREQUENT,
  });

  return {
    orders: data?.orders ?? null,
    totalPages: data?.totalPages ?? 0,
    currentPage,
    setCurrentPage,
    loading,
    error: error?.message || null,

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
