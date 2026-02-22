"use client";

import { Button, Box, Tooltip } from "@mui/material";
import { Card, CardActions, CardContent, Typography } from "@mui/material";
import Link from "next/link";
import React, { useState } from "react";
import { useOrderContext } from "../context/order/useOrderContext";
import ProductImage from "../app/(main)/product/[id]/ProductImage";
import { toCapitalizeWords } from "../utils/cases";
import ProductDesignChip from "./ProductDesignChip";

export const ProductCard = ({ product, onViewMore, showBtns = true }) => {
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
        height: "432px",
        borderRadius: "12px",
        padding: "8px",
      }}
    >
      <Link href={`/product/${product.id}`} passHref>
        <div style={{ position: "relative", width: "100%" }}>
          {imagePublicId && (
            <ProductImage publicId={imagePublicId} name={product.name} heightFactor={2.3} />
          )}
        </div>

        <CardContent
          sx={{
            flexGrow: 1,
            paddingTop: 2,
            paddingBottom: 0,
            minHeight: "120px", // Fixed minimum height for content area
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
              <Typography
                variant="body2"
                color="text.secondary"
                fontSize="14px"
                sx={{ fontWeight: "bold" }}
              >
                {toCapitalizeWords(product?.brand?.name)}
              </Typography>
              <Typography variant="body2" color="text.secondary" fontSize="14px">
                SKU {product.code}
              </Typography>
            </Box>
            <Tooltip title={toCapitalizeWords(product?.name)}>
              <Typography
                gutterBottom
                variant="subtitle1"
                component="div"
                color="#13161b"
                fontSize="16px"
                sx={{
                  WebkitLineClamp: 1,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                }}
              >
                {toCapitalizeWords(product?.name)}
              </Typography>
            </Tooltip>
          </Box>
          <Tooltip title={toCapitalizeWords(product?.name)}>
            <Typography
              variant="body2"
              color="text.secondary"
              fontSize="14px"
              sx={{
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textOverflow: "ellipsis",
                mb: 1,
                cursor: "pointer",
                height: "4.5rem", // Fixed height for 3 lines (1.5rem per line)
                lineHeight: "1.5rem",
              }}
            >
              {toCapitalizeWords(product?.description)}
            </Typography>
          </Tooltip>
        </CardContent>
        <ProductDesignChip designName={product?.design?.name} typeName={product?.type?.name} />
      </Link>
      {showBtns && (
        <CardActions sx={{ justifyContent: "space-between", flexDirection: "row" }}>
          <Button variant="outlined" fullWidth onClick={() => onViewMore(product.id)}>
            Ver más
          </Button>
          <Button variant="contained" color="primary" fullWidth onClick={handleAddToOrder}>
            Añadir a la orden
          </Button>
        </CardActions>
      )}
    </Card>
  );
};
