import { Card, CardContent, CardMedia, Typography } from "@mui/material";

const QuoteProductCard = ({ product }) => (
  <Card variant="outlined" key={product.id} sx={{ mb: 2 }}>
    <CardMedia
      component="img"
      image={product.Files && product.Files[0]?.path}
      alt={product.name}
      sx={{ height: 140, objectFit: "contain" }}
    />
    <CardContent>
      <Typography variant="subtitle1">{product.name}</Typography>
      <Typography variant="body2" color="text.secondary">
        {product.code}
      </Typography>
      <Typography>
        <strong>Cantidad:</strong> {product.QuoteProduct?.quantity}
      </Typography>
    </CardContent>
  </Card>
);

export default QuoteProductCard;
