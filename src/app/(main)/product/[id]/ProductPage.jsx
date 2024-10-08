"use client";

import { Button, Grid, Typography, Box } from "@mui/material";
import Image from "next/image";
import { useState } from "react";
import { useOrder } from "../../../../hooks/order/useOrder";

const ProductPage = ({ product }) => {
  const [quantity] = useState(1);
  const { addToOrder } = useOrder();

  const handleAddToOrder = () => {
    addToOrder(product, quantity);
  };

  return (
    <Box width="100%">
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Image
            src={product.Files[0]?.path || "/fallback-image.jpg"}
            alt={product.name}
            width={500}
            height={500}
            style={{ objectFit: "contain", width: "100%", height: "auto" }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h4" gutterBottom>{product.name}</Typography>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            {product?.brand?.name} - {product?.code}
          </Typography>
          <Typography variant="h6">Descripción</Typography>
          <Typography paragraph>{product.description}</Typography>
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 3 }}
            onClick={handleAddToOrder}
          >
            Añadir a la orden
          </Button>
        </Grid>
      </Grid>

      {/* Descripción completa */}
      <Box mt={4}>
        <Typography variant="h5" gutterBottom>Descripción</Typography>
        <Box sx={{ borderBottom: "2px solid #e53935", width: "80px", mb: 2 }} />
        <Typography variant="body1">{product.description}</Typography>
      </Box>

      {/* Características */}
      {product.specifications && (
        <Box mt={4}>
          <Typography variant="h5" gutterBottom>Características</Typography>
          <Box sx={{ borderBottom: "2px solid #e53935", width: "80px", mb: 2 }} />
          <Typography variant="body1">{product.specifications}</Typography>
        </Box>
      )}
    </Box>
  );
};

export default ProductPage;
