"use client";

import { Button, Box, Tooltip } from "@mui/material";
import { Card, CardActions, CardContent, Typography } from "@mui/material";
import Link from "next/link";
import React, { useState } from "react";
import { useOrderContext } from "../context/order/useOrderContext";
import ProductImage from "../app/(main)/product/[id]/ProductImage";

export const ProductCard = ({
  product,
  onViewMore,
  showBtns = true,
  priority = false,
}) => {
  const [quantity] = useState(1);
  const { addToOrder } = useOrderContext();

  const handleAddToOrder = () => {
    addToOrder(product, quantity);
  };

  const imagePublicId = product?.Files?.[0]?.publicId;

  return (
    <Card
      sx={{
        maxWidth: { xs: "100%", md: 330 },
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        minHeight: 350,
        borderRadius: "12px",
        padding: "8px",
      }}
    >
      <Link href={`/product/${product.id}`} passHref>
        <div style={{ position: "relative", height: 150, width: "100%" }}>
          {imagePublicId && (
            <ProductImage
              publicId={imagePublicId}
              name={product.name}
              heightFactor={2.3}
            />
          )}
        </div>

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
              SKU {product.code}
            </Typography>
          </Box>
          <Tooltip title={product?.name}>
            <Typography
              gutterBottom
              variant="subtitle1"
              component="div"
              color="#13161b"
              sx={{
                WebkitLineClamp: 1,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
              }}
            >
              {product?.name}
            </Typography>
          </Tooltip>
          <Tooltip title={product?.name}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textOverflow: "ellipsis",
                mb: 1,
                cursor: "pointer",
              }}
            >
              {product?.description}
            </Typography>
          </Tooltip>
        </CardContent>
      </Link>
      {showBtns && (
        <CardActions
          sx={{ justifyContent: "space-between", flexDirection: "row" }}
        >
          <Button
            variant="outlined"
            fullWidth
            onClick={() => onViewMore(product.id)}
          >
            Ver más
          </Button>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleAddToOrder}
          >
            Añadir a la orden
          </Button>
        </CardActions>
      )}
    </Card>
  );
};
