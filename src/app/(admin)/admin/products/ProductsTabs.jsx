"use client";

import { useState } from "react";
import { Box, Tabs, Tab } from "@mui/material";
import Products from "./Products";
import AddProduct from "./add-product/AddProduct";

const ProductsTabs = () => {
  const [tab, setTab] = useState(0);

  return (
    <Box>
      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        sx={{ mb: 2, borderBottom: 1, borderColor: "divider" }}
      >
        <Tab label="Ver Productos" />
        <Tab label="Agregar Productos" />
      </Tabs>
      {tab === 0 && <Products />}
      {tab === 1 && <AddProduct />}
    </Box>
  );
};

export default ProductsTabs;
