import { Card, CardContent, Typography } from "@mui/material";
import { CloudinaryImage } from "../../../../../components/CloudinaryImage";
import { toCapitalizeWords } from "../../../../../utils/cases";

const QuoteProductCard = ({ product }) => (
  <Card variant="outlined" key={product.id}>
    <div style={{ position: "relative", height: 140, margin: "16px" }}>
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
      <Typography variant="body" color="primary.main">
        {toCapitalizeWords(product.brand?.name)}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        SKU {product.code}
      </Typography>
      <Typography>
        <strong>Cantidad:</strong> {product.QuoteProduct?.quantity}
      </Typography>
    </CardContent>
  </Card>
);

export default QuoteProductCard;
