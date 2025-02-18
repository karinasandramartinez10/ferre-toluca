"use client";

import { Box, IconButton, TextField, Typography } from "@mui/material";
import { useOrder } from "../../../hooks/order/useOrder";
import Image from "next/image";
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";

const CheckoutNewPage = ({ session }) => {
  console.log("✅ CheckoutNewPage se está renderizando");
  const { orderItems } = useOrder();

  console.log("🛒 orderItems en CheckoutNewPage:", orderItems);

  if (!orderItems) {
    console.error(
      "❌ orderItems es undefined. El contexto no está disponible."
    );
    return <Typography variant="h4">Error cargando carrito</Typography>;
  }

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
              <IconButton
                size="small"
                // onClick={() => handleQuantityChange(product.id, quantity - 1)}
              >
                <RemoveIcon />
              </IconButton>
              <TextField
                type="number"
                variant="outlined"
                size="small"
                value={quantity}
                /*               onChange={(e) =>
                  handleQuantityChange(product.id, Number(e.target.value))
                } */
                inputProps={{ min: 1, style: { textAlign: "center" } }}
                sx={{ width: "100px", mx: 1 }}
              />
              <IconButton
                size="small"
                // onClick={() => handleQuantityChange(product.id, quantity + 1)}
              >
                <AddIcon />
              </IconButton>
            </Box>
          </Box>

          <IconButton
            color="primary" //#13161b
            // onClick={() => removeFromOrder(product.id)}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ))}
    </Box>
  );
};

export default CheckoutNewPage;
