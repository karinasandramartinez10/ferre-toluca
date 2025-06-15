import { Card, CardContent, CardMedia, Typography } from "@mui/material";

const QuoteProductCard = ({ product }) => (
  <Card variant="outlined" key={product.id}>
    <CardMedia
      component="img"
      image={product.Files && product.Files[0]?.path}
      alt={product.name}
      sx={{ height: 140, objectFit: "contain", margin: "16px" }}
    />
    <CardContent>
      <Typography variant="subtitle1">{product.name}</Typography>
      <Typography variant="body" color="primary.main">{product.brand.name}</Typography>
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
