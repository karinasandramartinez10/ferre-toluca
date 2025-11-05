import { Box, Grid } from "@mui/material";
import { useState } from "react";
import QuoteCard from "./QuoteCard";

const HistoryList = ({ orders }) => {
  const [expandedOrder, setExpandedOrder] = useState(null);

  const handleToggle = (orderNumber) => {
    setExpandedOrder((prev) => (prev === orderNumber ? null : orderNumber));
  };

  return (
    <Box mt={2}>
      <Grid container spacing={2}>
        {orders.map((order) => (
          <Grid item xs={12} sm={6} md={4} key={order.orderNumber}>
            <QuoteCard
              order={order}
              expanded={expandedOrder === order.orderNumber}
              onToggle={() => handleToggle(order.orderNumber)}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default HistoryList;
