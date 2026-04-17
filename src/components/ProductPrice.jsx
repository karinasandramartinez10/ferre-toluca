"use client";

import { Typography, Box, Chip } from "@mui/material";
import { formatPrice } from "../utils/currency";
import { PRICING_LABELS } from "../constants/pricing";

const ProductPrice = ({ retailPrice, wholesalePrice, pricingMode, size = "medium" }) => {
  const isWholesale = pricingMode === "wholesale";
  const activePrice = isWholesale ? wholesalePrice : retailPrice;
  const formattedActive = formatPrice(activePrice);

  // Solo mostrar precio tachado en modo Mayoreo (retailPrice tachado = muestra ahorro)
  // En modo Menudeo no mostramos el precio mayoreo porque es menor y confunde
  const formattedRetailStrike = isWholesale ? formatPrice(retailPrice) : null;

  if (!formattedActive) {
    return (
      <Typography
        variant={size === "small" ? "body2" : "subtitle1"}
        color="text.secondary"
        fontStyle="italic"
      >
        Consultar precio
      </Typography>
    );
  }

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
      {formattedRetailStrike && (
        <Typography variant="body2" color="text.disabled" sx={{ textDecoration: "line-through" }}>
          {formattedRetailStrike}
        </Typography>
      )}
      <Typography
        variant={size === "small" ? "subtitle2" : "h6"}
        color="primary.main"
        fontWeight={700}
      >
        {formattedActive}
      </Typography>
      {size !== "small" && (
        <Chip
          label={PRICING_LABELS[pricingMode]}
          size="small"
          color={isWholesale ? "secondary" : "default"}
          variant="outlined"
        />
      )}
    </Box>
  );
};

export default ProductPrice;
