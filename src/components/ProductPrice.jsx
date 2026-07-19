"use client";

import { Box, Chip, Typography } from "@mui/material";
import { formatPrice } from "../utils/currency";

const ProductPrice = ({
  price,
  priceList,
  discountPercentage,
  finalPrice,
  promotion,
  size = "medium",
  showDiscountPercentage = false,
}) => {
  const hasPromo = finalPrice != null && Number(finalPrice) < Number(price);
  const effectivePrice = hasPromo ? finalPrice : price;
  const formattedPrice = formatPrice(effectivePrice);

  const tierHasDiscount =
    discountPercentage != null && priceList != null && Number(priceList) > Number(price);
  // Con promo activa se tacha el precio de tier; sin promo, el de lista (descuento de tier).
  const strikeValue = hasPromo ? price : tierHasDiscount ? priceList : null;
  const formattedStrike = strikeValue != null ? formatPrice(strikeValue) : null;
  const badgePercentage = hasPromo
    ? promotion?.discountPercentage
    : tierHasDiscount
      ? discountPercentage
      : null;

  if (!formattedPrice) {
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
        <Typography variant={mainVariant} color="text.primary" fontWeight={700}>
          Precio bajo cotización
        </Typography>
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
      {formattedStrike && (
        <Typography
          variant={strikeVariant}
          color="text.disabled"
          sx={{ textDecoration: "line-through" }}
        >
          {formattedStrike}
        </Typography>
      )}
      <Typography variant={priceVariant} color="primary.main" fontWeight={700}>
        {formattedPrice}
      </Typography>
      {showDiscountPercentage && badgePercentage != null && (
        <Chip label={`-${badgePercentage}%`} size="small" color="primary" />
      )}
    </Box>
  );
};

export default ProductPrice;
