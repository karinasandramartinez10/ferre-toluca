"use client";

import { Box, Typography, Button, TextField, IconButton } from "@mui/material";
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { useOrder } from "../../../hooks/order/useOrder";
import Image from "next/image";

const CheckoutPage = () => {
  const {
    orderItems,
    updateQuantity,
    removeFromOrder,
    clearOrder,
    totalItems,
  } = useOrder();

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity > 0) {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleCheckout = () => {
    // Aquí puedes manejar la lógica de checkout
    alert("Procediendo a generar la orden...");
    // Redirigir a otra página o realizar otra acción
  };

  if (orderItems.length === 0) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" textAlign="center">
          Tu carrito está vacío.
        </Typography>
      </Box>
    );
  }

  return (
    <Box width="100%" sx={{ p: 2 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Checkout
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
          gap={2}
        >
          <Image
            src={product.Files && product.Files[0]?.path}
            alt={product.name}
            width={80}
            height={80}
            style={{ marginRight: 8, objectFit: "contain" }}
          />

          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="body2">{product.name}</Typography>
            <Typography variant="caption" color="text.secondary">
              {product.code}
            </Typography>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                mt: 1,
              }}
            >
              <IconButton
                size="small"
                onClick={() => handleQuantityChange(product.id, quantity - 1)}
              >
                <RemoveIcon />
              </IconButton>
              <TextField
                type="number"
                variant="outlined"
                size="small"
                value={quantity}
                onChange={(e) =>
                  handleQuantityChange(product.id, Number(e.target.value))
                }
                inputProps={{ min: 1, style: { textAlign: "center" } }}
                sx={{ width: "100px", mx: 1 }}
              />
              <IconButton
                size="small"
                onClick={() => handleQuantityChange(product.id, quantity + 1)}
              >
                <AddIcon />
              </IconButton>
            </Box>
          </Box>

          <IconButton
            color="secondary"
            onClick={() => removeFromOrder(product.id)}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ))}

      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
        <Typography variant="h6">Total de productos: {totalItems}</Typography>
        {/* Si tuvieras un precio total, lo mostrarías aquí */}
        {/* <Typography variant="h6">Precio Total: ${totalPrice}</Typography> */}
      </Box>

      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
        <Button variant="outlined" color="secondary" onClick={clearOrder}>
          Vaciar Carrito
        </Button>
        <Button variant="contained" color="primary" onClick={handleCheckout}>
          Proceder a la Orden
        </Button>
      </Box>
    </Box>
  );
};

export default CheckoutPage;
