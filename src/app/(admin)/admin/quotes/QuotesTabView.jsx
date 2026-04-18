"use client";

import { useState } from "react";
import { Box, Tabs, Tab } from "@mui/material";
import { Quotes } from "./Quotes";

const QuotesTabView = () => {
  const [tab, setTab] = useState(0);

  return (
    <Box>
      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        sx={{ mb: 2, borderBottom: 1, borderColor: "divider" }}
      >
        <Tab label="Pendientes" />
        <Tab label="Enviadas" />
      </Tabs>
      {tab === 0 && (
        <Quotes
          statusFilter={null}
          excludeStatus="DISPATCHED"
          printTitle="Cotizaciones pendientes"
          printWindowTitle="Cotizaciones pendientes"
          basePath="/admin/quotes"
        />
      )}
      {tab === 1 && (
        <Quotes
          statusFilter="DISPATCHED"
          excludeStatus={null}
          printTitle="Cotizaciones enviadas"
          printWindowTitle="Cotizaciones enviadas"
          basePath="/admin/quotes"
        />
      )}
    </Box>
  );
};

export default QuotesTabView;
