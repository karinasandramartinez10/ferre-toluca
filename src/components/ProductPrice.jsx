"use client";

import { Typography, Box, Chip } from "@mui/material";
import { formatPrice } from "../utils/currency";
import { PRICING_LABELS } from "../constants/pricing";

const PricingModeChip = ({ pricingMode, size }) => (
  <Chip
    label={PRICING_LABELS[pricingMode]}
    size="small"
    color={pricingMode === "wholesale" ? "secondary" : "default"}
    variant={size === "large" ? "filled" : "outlined"}
  />
);

const ProductPrice = ({ retailPrice, wholesalePrice, pricingMode, size = "medium" }) => {
  const isWholesale = pricingMode === "wholesale";
  const activePrice = isWholesale ? wholesalePrice : retailPrice;
  const formattedActive = formatPrice(activePrice);
  const formattedRetailStrike = isWholesale ? formatPrice(retailPrice) : null;

  if (!formattedActive) {
    if (size === "small") {
      return (
        <Typography variant="body2" color="text.primary" fontWeight={600}>
          Precio bajo cotización
        </Typography>
      );
    }

    const mainVariant = size === "large" ? "h5" : "subtitle1";
    const microVariant = size === "large" ? "body2" : "caption";

    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
          <Typography variant={mainVariant} color="text.primary" fontWeight={700}>
            Precio bajo cotización
          </Typography>
          <PricingModeChip pricingMode={pricingMode} size={size} />
        </Box>
        <Typography variant={microVariant} color="text.secondary">
          Agrégalo a tu orden y te confirmamos el precio.
        </Typography>
      </Box>
    );
  }

  const priceVariant = size === "small" ? "subtitle2" : size === "large" ? "h4" : "h6";
  const strikeVariant = size === "large" ? "body1" : "body2";

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
      {formattedRetailStrike && (
        <Typography
          variant={strikeVariant}
          color="text.disabled"
          sx={{ textDecoration: "line-through" }}
        >
          {formattedRetailStrike}
        </Typography>
      )}
      <Typography variant={priceVariant} color="primary.main" fontWeight={700}>
        {formattedActive}
      </Typography>
      {size !== "small" && <PricingModeChip pricingMode={pricingMode} size={size} />}
    </Box>
  );
};

export default ProductPrice;
