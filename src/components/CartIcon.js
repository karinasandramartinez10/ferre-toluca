"use client";

import { useState } from "react";
import {
  Box,
  IconButton,
  Badge,
  Typography,
  Popover,
  TextField,
  Button,
} from "@mui/material";
import {
  ShoppingCart as ShoppingCartIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
} from "@mui/icons-material";
import { useOrder } from "../hooks/order/useOrder";
import Link from "next/link";

const CartIcon = () => {
  const { orderItems, removeFromOrder, updateQuantity, totalItems } =
    useOrder();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity > 0) {
      updateQuantity(productId, newQuantity);
    }
  };

  return (
    <Box>
      <IconButton aria-label="cart" onClick={handleClick}>
        <Badge badgeContent={totalItems} color="secondary">
          <ShoppingCartIcon />
        </Badge>
      </IconButton>

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
                  <img
                    src={product.Files && product.Files[0]?.path}
                    alt={product.name}
                    width="50"
                    style={{ marginRight: 8 }}
                  />

                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="body2">{product.name}</Typography>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        mt: 1,
                      }}
                      justifyContent="center"
                    >
                      <IconButton
                        size="small"
                        onClick={() =>
                          handleQuantityChange(product.id, quantity - 1)
                        }
                      >
                        <RemoveIcon />
                      </IconButton>
                      <TextField
                        type="number"
                        variant="outlined"
                        size="small"
                        value={quantity}
                        onChange={(e) =>
                          handleQuantityChange(
                            product.id,
                            Number(e.target.value)
                          )
                        }
                        inputProps={{ min: 1, style: { textAlign: "center" } }}
                        sx={{ width: "100px", mx: 1 }}
                      />
                      <IconButton
                        size="small"
                        onClick={() =>
                          handleQuantityChange(product.id, quantity + 1)
                        }
                      >
                        <AddIcon />
                      </IconButton>
                      <IconButton
                        color="secondary"
                        onClick={() => removeFromOrder(product.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>
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

export default CartIcon;
