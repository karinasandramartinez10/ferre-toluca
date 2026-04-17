import { Card, CardContent, Typography, Chip, Box } from "@mui/material";
import { CloudinaryImage } from "../../../../../components/CloudinaryImage";
import { toCapitalizeWords } from "../../../../../utils/cases";
import { formatPrice } from "../../../../../utils/currency";
import { PRICING_LABELS } from "../../../../../constants/pricing";
import type { QuoteProduct } from "../../../../../types/quote";

interface QuoteProductCardProps {
  product: QuoteProduct;
}

const QuoteProductCard = ({ product }: QuoteProductCardProps) => {
  const qp = product.QuoteProduct;
  const unitPriceFormatted = formatPrice(qp?.unitPrice);
  const priceType = qp?.priceType;

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
        <Typography variant="subtitle1">{toCapitalizeWords(product.name)}</Typography>
        <Typography variant="body1" color="primary.main">
          {toCapitalizeWords(product.brand?.name)}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          SKU {product.code}
        </Typography>
        <Typography>
          <strong>Cantidad:</strong> {qp?.quantity}
        </Typography>
        {unitPriceFormatted && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
            <Typography variant="body2" fontWeight={600}>
              {unitPriceFormatted} c/u
            </Typography>
            {priceType && (
              <Chip
                label={PRICING_LABELS[priceType] || priceType}
                size="small"
                variant="outlined"
                color={priceType === "wholesale" ? "secondary" : "default"}
              />
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default QuoteProductCard;
