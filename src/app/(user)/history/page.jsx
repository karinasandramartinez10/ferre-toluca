"use client";

import { Box, Grid, Typography } from "@mui/material";
import { ErrorUI } from "../../../components/Error";
import { Loading } from "../../../components/Loading";
import Pagination from "../../../components/Pagination";
import { useOrderHistory } from "../../../hooks/order/useOrderHistory";
import HistoryList from "./HistoryList";

export default function HistoryPage() {
  const { loading, error, orders, totalPages, currentPage, setCurrentPage } =
    useOrderHistory();

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <Grid container>
      <Grid item xs={12}>
        <Typography component="h1" variant="h1" mb={2}>
          Historial de órdenes
        </Typography>
        {loading && <Loading />}
        {error && <ErrorUI />}
        {!loading && orders?.length === 0 && (
          <Typography>No tienes órdenes previas</Typography>
        )}
        {!loading && orders?.length > 0 && <HistoryList orders={orders} />}
      </Grid>
      <Box display="flex" width="100%" mb={4}>
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </Box>
    </Grid>
  );
}
