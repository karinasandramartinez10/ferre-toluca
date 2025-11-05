"use client";

import { Box, Grid } from "@mui/material";
import { ErrorUI } from "../../../../../components/Error";
import { Loading } from "../../../../../components/Loading";
import Pagination from "../../../../../components/Pagination";
import { useOrderHistory } from "../../../../../hooks/order/useOrderHistory";
import HistoryList from "./HistoryList";
import EmptyQuotes from "./EmptyQuotes";
import { StatusFilter } from "./StatusFilter";
import SearchFilter from "./SearchFilter";
import DateFilters from "./DateFilters";

export default function HistoryPage() {
  const {
    loading,
    error,
    orders,
    totalPages,
    currentPage,
    status,
    search,
    dateFrom,
    dateTo,
    setDateFrom,
    setDateTo,
    setSearch,
    setCurrentPage,
    setStatus,
  } = useOrderHistory();

  const handleSearch = (value) => {
    setSearch(value);
    setCurrentPage(1);
  };
  const handleFrom = (date) => {
    setDateFrom(date);
    setCurrentPage(1);
  };
  const handleTo = (date) => {
    setDateTo(date);
    setCurrentPage(1);
  };
  const handlePage = (page) => setCurrentPage(page);

  return (
    <Grid container>
      <Grid item xs={12}>
        <Box display="flex" gap={2} mt={2} flexDirection={{ xs: "column", md: "row" }}>
          <StatusFilter
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setCurrentPage(1);
            }}
          />
          <SearchFilter initialValue={search} onSearch={handleSearch} />
          <DateFilters
            dateFrom={dateFrom}
            dateTo={dateTo}
            onFromChange={handleFrom}
            onToChange={handleTo}
          />
        </Box>

        {loading && <Loading />}
        {error && <ErrorUI />}
        {!loading && orders?.length === 0 && <EmptyQuotes />}
        {!loading && orders?.length > 0 && <HistoryList orders={orders} />}
      </Grid>
      <Box display="flex" width="100%" mb={4}>
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePage}
          />
        )}
      </Box>
    </Grid>
  );
}
