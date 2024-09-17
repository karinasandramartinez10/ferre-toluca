import { Grid, Card, CardContent, CardMedia, Typography } from "@mui/material";

const ProductGrid = ({ products }) => {
  return (
    <Grid container spacing={3} mt={2}>
      {products.length > 0 ? (
        products.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                image={product.imageUrl || "/placeholder.png"}
                alt={product.name}
              />
              <CardContent>
                <Typography variant="h6" component="div">
                  {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {product.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))
      ) : (
        <Typography variant="h6" component="div">
          No hay productos disponibles para esta marca.
        </Typography>
      )}
    </Grid>
  );
};

export default ProductGrid;
