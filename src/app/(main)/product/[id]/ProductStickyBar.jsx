"use client";

import { Box, Button } from "@mui/material";
import ProductPrice from "../../../../components/ProductPrice";

const ProductStickyBar = ({ retailPrice, wholesalePrice, pricingMode, onAdd, disabled }) => (
  <Box
    sx={{
      display: { xs: "flex", md: "none" },
      position: "fixed",
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: (theme) => theme.zIndex.appBar,
      bgcolor: "background.paper",
      borderTop: "1px solid",
      borderColor: "divider",
      px: 2,
      py: 1.25,
      gap: 1.5,
      alignItems: "center",
      boxShadow: "0 -2px 8px rgba(0,0,0,0.08)",
      pb: "calc(10px + env(safe-area-inset-bottom))",
    }}
  >
    <Box sx={{ flex: 1, minWidth: 0 }}>
      <ProductPrice
        retailPrice={retailPrice}
        wholesalePrice={wholesalePrice}
        pricingMode={pricingMode}
        size="small"
      />
    </Box>
    <Button
      variant="contained"
      color="primary"
      onClick={() => onAdd(1)}
      disabled={disabled}
      sx={{ minWidth: 140 }}
    >
      {disabled ? "No disponible" : "Añadir"}
    </Button>
  </Box>
);

export default ProductStickyBar;
