"use client";

import { useState } from "react";
import { Box, Tab, Tabs } from "@mui/material";
import PromotionCatalogBoard from "./PromotionCatalogBoard";
import Promotions from "./Promotions";

const PromotionsHub = () => {
  const [tab, setTab] = useState(0);

  return (
    <Box>
      <Tabs
        value={tab}
        onChange={(_e, value) => setTab(value)}
        sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}
      >
        <Tab label="Crear" />
        <Tab label="Gestionar" />
      </Tabs>
      {tab === 0 ? <PromotionCatalogBoard /> : <Promotions />}
    </Box>
  );
};

export default PromotionsHub;
