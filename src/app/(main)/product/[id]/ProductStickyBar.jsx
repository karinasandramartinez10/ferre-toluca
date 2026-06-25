"use client";

import { Box, Button } from "@mui/material";
import ProductPrice from "../../../../components/ProductPrice";

const ProductStickyBar = ({
  price,
  priceList,
  discountPercentage,
  finalPrice,
  promotion,
  onAdd,
  disabled,
}) => (
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
        price={price}
        priceList={priceList}
        discountPercentage={discountPercentage}
        finalPrice={finalPrice}
        promotion={promotion}
        size="small"
        showDiscountPercentage
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
