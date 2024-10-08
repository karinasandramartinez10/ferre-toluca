"use client";

import { Button, Box } from "@mui/material";
import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import Link from "next/link";
import React, { useState } from "react";
import { useOrder } from "../hooks/order/useOrder";

export const ProductCard = ({ product }) => {
  const [quantity] = useState(1);
  const { addToOrder } = useOrder();

  const handleAddToOrder = () => {
    addToOrder(product, quantity);
  };

  return (
    <Card
      sx={{
        maxWidth: { xs: "100%", md: 345 },
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        minHeight: 400,
      }}
    >
      <Link href={`/product/${product.id}`} passHref>
        <CardMedia
          component="img"
          image={product.Files && product.Files[0]?.path}
          sx={{ height: 180, objectFit: "contain" }}
          alt={product.name}
        />

        <CardContent sx={{ flexGrow: 1 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontWeight: "bold" }}
            >
              {product?.brand?.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {product.code}
            </Typography>
          </Box>

          <Typography gutterBottom variant="h6" component="div">
            {product?.name}
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {product?.description}
          </Typography>
        </CardContent>
      </Link>

      <CardActions sx={{ justifyContent: "center" }}>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleAddToOrder}
        >
          Añadir a la cotización
        </Button>
      </CardActions>
    </Card>
  );
};
