import { Box, Card, Typography, Tooltip, Chip, Stack } from "@mui/material";
import { CloudinaryImage } from "../../../../../components/CloudinaryImage";
import { formatPrice } from "../../../../../utils/currency";
import { PRICING_LABELS } from "../../../../../constants/pricing";

export const ProductItem = ({ product }) => {
  const name = product.name;
  const qp = product.QuoteProduct;
  const qty = qp.quantity;
  const unitPrice = formatPrice(qp.unitPrice);
  const priceType = qp.priceType;

  return (
    <Card
      variant="outlined"
      sx={{
        display: "flex",
        alignItems: "center",
        p: 1,
        gap: 1,
        boxShadow: "none",
      }}
    >
      <CloudinaryImage
        publicId={product.Files?.[0]?.publicId}
        alt={name}
        width={40}
        height={40}
        crop="fill"
        quality="auto:best"
        style={{ objectFit: "contain", borderRadius: 4 }}
      />
      <Box
        sx={{
          flexGrow: 1,
          minWidth: 0,
          overflow: "hidden",
        }}
      >
        <Stack>
          <Tooltip title={name}>
            <Typography variant="caption" noWrap sx={{ fontWeight: 500 }}>
              {name}
            </Typography>
          </Tooltip>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, flexWrap: "wrap" }}>
            <Chip label={`x${qty}`} size="small" />
            {unitPrice && (
              <Typography variant="caption" color="primary.main" fontWeight={600}>
                {unitPrice}
              </Typography>
            )}
            {priceType && unitPrice && (
              <Chip
                label={PRICING_LABELS[priceType] || priceType}
                size="small"
                variant="outlined"
                color={priceType === "wholesale" ? "secondary" : "default"}
              />
            )}
          </Box>
        </Stack>
      </Box>
    </Card>
  );
};
