"use client";

import { Box, Typography, IconButton } from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";
import Image from "next/image";
import { QuantityField } from "../../../components/QuantityField";

const OrderItemRow = ({ product, quantity, onRemove }) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      mb: 2,
      borderBottom: "1px solid #ddd",
      pb: 2,
    }}
    gap={2}
  >
    <Image
      src={product.Files?.[0]?.path ?? "/images/placeholder.png"}
      alt={product.name}
      width={80}
      height={80}
      style={{ marginRight: 8, objectFit: "contain" }}
    />

    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="subtitle1">{product.name}</Typography>
      <Typography variant="body3" color="text.secondary">
        {product.code}
      </Typography>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mt: 1,
        }}
      >
        <QuantityField productId={product.id} quantity={quantity} />
      </Box>
    </Box>

    <IconButton color="primary" onClick={onRemove}>
      <DeleteIcon />
    </IconButton>
  </Box>
);

export default OrderItemRow;
