"use client";

import { useState } from "react";
import {
  Box,
  IconButton,
  Badge,
  Typography,
  Popover,
  Button,
  Tooltip,
} from "@mui/material";
import {
  ShoppingCart as ShoppingCartIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import Link from "next/link";
import Image from "next/image";
import { QuantityField } from "./QuantityField";
import { useOrderContext } from "../context/order/useOrderContext";

const Cart = () => {
  const { orderItems, removeFromOrder, totalItems } = useOrderContext();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <Box>
      <Tooltip title="Carrito de productos" arrow>
        <IconButton aria-label="cart" onClick={handleClick}>
          <Badge badgeContent={totalItems} color="secondary">
            <ShoppingCartIcon />
          </Badge>
        </IconButton>
      </Tooltip>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        slotProps={{
          paper: {
            style: { maxHeight: 400, overflow: "auto", width: 350 },
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          {orderItems.length === 0 ? (
            <Typography variant="body2">
              No hay productos en el carrito.
            </Typography>
          ) : (
            <>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                {totalItems} productos
              </Typography>
              {orderItems.map(({ product, quantity }) => (
                <Box
                  key={product.id}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mb: 2,
                    borderBottom: "1px solid #ddd",
                    pb: 2,
                  }}
                >
                  <Image
                    src={product.Files?.[0]?.path || "/placeholder.jpg"}
                    alt={product.name}
                    width={50}
                    height={50}
                    style={{ marginRight: 8, objectFit: "cover" }}
                  />

                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="body2">{product.name}</Typography>
                    <Box sx={{ mt: 1 }}>
                      <QuantityField
                        productId={product.id}
                        quantity={quantity}
                      />
                    </Box>
                  </Box>
                  <IconButton
                    color="primary"
                    onClick={() => removeFromOrder(product.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}
              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mb: 1 }}
                LinkComponent={Link}
                href="/checkout"
                onClick={handleClose}
              >
                Ir a generar orden
              </Button>
            </>
          )}
        </Box>
      </Popover>
    </Box>
  );
};

export default Cart;
