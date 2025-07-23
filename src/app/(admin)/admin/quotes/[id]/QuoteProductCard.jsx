import { Card, CardContent, Typography } from "@mui/material";
import { CldImage } from "next-cloudinary";

const QuoteProductCard = ({ product }) => (
  <Card variant="outlined" key={product.id}>
    <div style={{ position: "relative", height: 140, margin: "16px" }}>
      <CldImage
        src={product.Files[0].publicId}
        alt={product.name}
        fill
        style={{ objectFit: "contain" }}
        crop="fill"
        quality="auto:best"
        format="auto"
      />
    </div>
    <CardContent>
      <Typography variant="subtitle1">{product.name}</Typography>
      <Typography variant="body" color="primary.main">
        {product.brand.name}
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
