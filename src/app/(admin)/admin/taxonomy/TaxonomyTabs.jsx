"use client";

import { useState } from "react";
import { Box, Tabs, Tab } from "@mui/material";
import Categories from "./Categories";
import Subcategories from "./Subcategories";
import ProductTypes from "./ProductType";

const TaxonomyTabs = () => {
  const [tab, setTab] = useState(0);

  return (
    <Box>
      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        sx={{ mb: 2, borderBottom: 1, borderColor: "divider" }}
      >
        <Tab label="Categorías" />
        <Tab label="Subcategorías" />
        <Tab label="Tipos de Producto" />
      </Tabs>
      {tab === 0 && <Categories />}
      {tab === 1 && <Subcategories />}
      {tab === 2 && <ProductTypes />}
    </Box>
  );
};

export default TaxonomyTabs;
