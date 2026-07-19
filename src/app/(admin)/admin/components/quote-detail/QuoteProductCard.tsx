import { Card, CardContent, Typography, Chip, Box, Stack } from "@mui/material";
import { CloudinaryImage } from "../../../../../components/CloudinaryImage";
import { toCapitalizeWords } from "../../../../../utils/cases";
import { formatPrice } from "../../../../../utils/currency";
import { TIER_LABELS } from "../../../../../constants/pricing";
import { getQuoteLineTotal } from "../../../../../helpers/quotes";
import type { QuoteProduct } from "../../../../../types/quote";

interface QuoteProductCardProps {
  product: QuoteProduct;
}

const QuoteProductCard = ({ product }: QuoteProductCardProps) => {
  const qp = product.QuoteProduct;
  const unitPriceFormatted = formatPrice(qp?.unitPrice);
  const priceType = qp?.priceType;
  const discountAmount = qp?.discountAmount ?? 0;
  const lineTotal = getQuoteLineTotal(qp);

  return (
    <Card variant="outlined" key={product.id}>
      <div style={{ position: "relative", height: 140, margin: "16px" }}>
        {/* @ts-expect-error CloudinaryImage is untyped JS — fill mode doesn't need width/height */}
        <CloudinaryImage
          publicId={product.Files?.[0]?.publicId}
          alt={product.name}
          fill
          crop="fill"
          quality="auto:best"
          style={{ objectFit: "contain" }}
        />
      </div>
      <CardContent>
        <Stack spacing={0.75}>
          <Box>
            <Typography variant="subtitle1" fontWeight={600} lineHeight={1.3}>
              {toCapitalizeWords(product.name)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {toCapitalizeWords(product.brand?.name)}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              SKU {product.code}
            </Typography>
          </Box>
          <Typography variant="body2">
            <strong>Cantidad:</strong> {qp?.quantity}
          </Typography>
          {unitPriceFormatted && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography variant="body2" fontWeight={600}>
                {unitPriceFormatted} c/u
              </Typography>
              {priceType && (
                <Chip
                  label={TIER_LABELS[priceType] || priceType}
                  size="small"
                  variant="outlined"
                  color={priceType === "A" ? "default" : "secondary"}
                />
              )}
            </Box>
          )}
          {unitPriceFormatted && (qp?.promotionLabel || discountAmount > 0) && (
            <Stack spacing={0.5} alignItems="flex-start">
              {qp?.promotionLabel && (
                <Chip
                  label={qp.promotionLabel}
                  size="small"
                  color="secondary"
                  sx={{
                    fontWeight: 700,
                    height: "auto",
                    maxWidth: "100%",
                    "& .MuiChip-label": { whiteSpace: "normal", py: 0.25 },
                  }}
                />
              )}
              {discountAmount > 0 && (
                <Typography variant="body2" color="green.main" fontWeight={600}>
                  Descuento: -{formatPrice(discountAmount)}
                </Typography>
              )}
            </Stack>
          )}
          {unitPriceFormatted && (
            <Box
              sx={{
                mt: 0.5,
                pt: 1,
                borderTop: "1px solid",
                borderColor: "divider",
                display: "flex",
                alignItems: "baseline",
                justifyContent: "space-between",
              }}
            >
              <Typography variant="caption" color="text.secondary" fontWeight={600}>
                Total
              </Typography>
              <Typography variant="h6" fontWeight={700} color="primary.main">
                {formatPrice(lineTotal)}
              </Typography>
            </Box>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default QuoteProductCard;
