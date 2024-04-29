"use client";
import { Button } from "@mui/material";
import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import React from "react";

export const ProductCard = ({
  product,
  showQuoteButton,
  isAdmin,
  handleQuote,
}) => {
  const quoteButton = () => {
    if (isAdmin) return null;
    if (!showQuoteButton) {
      return (
        <Button fullWidth href="/auth/login">
          Inicia sesión para cotizar
        </Button>
      );
    }

    return (
      <Button fullWidth onClick={() => handleQuote(product)}>
        Solicitar cotización
      </Button>
    );
  };

  return (
    <Card>
      <CardMedia
        component="img"
        image={product.Files[0].path}
        sx={{ height: 235, objectFit: "contain" }}
        alt={product.name}
      />
      <CardContent sx={{ minHeight: 130 }}>
        <Typography gutterBottom variant="h5" component="div">
          {product.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {product.description}
        </Typography>
      </CardContent>
      <CardActions>{quoteButton()}</CardActions>
    </Card>
  );
};
