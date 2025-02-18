"use client";

import { Box, Typography, Button, TextField, IconButton } from "@mui/material";

import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { useOrder } from "../../../hooks/order/useOrder";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { signIn } from "next-auth/react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import { useSnackbar } from "notistack";
import { createQuote } from "../../../api/quote";
import { LoadingButton } from "@mui/lab";
import { useState } from "react";
import LoginContainer from "../../auth/login/LoginContainer";
import LoginForm from "../../auth/login/LoginForm";

const QuoteSchema = yup.object().shape({
  message: yup.string().required("El mensaje es requerido"),
});

const CheckoutPage = () => {
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();

  const isAuthenticated = !!session?.user;

  const {
    orderItems,
    updateQuantity,
    removeFromOrder,
    clearOrder,
    totalItems,
  } = useOrder();

  const {
    control,
    handleSubmit,
    formState: { isValid },
    reset,
  } = useForm({
    resolver: yupResolver(QuoteSchema),
    mode: "onChange",
    defaultValues: {
      message: "",
    },
  });

  const { enqueueSnackbar } = useSnackbar();

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity > 0) {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleCheckout = async (values) => {
    setLoading(true);
    try {
      const products = orderItems.map((item) => ({
        ProductId: item.product.id,
        quantity: item.quantity,
      }));

      const requestBody = {
        message: values.message,
        products,
      };

      await createQuote(requestBody, session.user.access_token);
      enqueueSnackbar("Solicitud de orden enviada correctamente.", {
        variant: "success",
        autoHideDuration: 5000,
        anchorOrigin: {
          vertical: "top",
          horizontal: "right",
        },
      });
      clearOrder();
      reset();
    } catch (error) {
      console.log(error);
      enqueueSnackbar("Hubo un error al procesar la orden", {
        variant: "error",
        autoHideDuration: 5000,
        anchorOrigin: {
          vertical: "top",
          horizontal: "right",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const onSignIn = async ({ email, password }) => {
    try {
      await signIn("credentials", {
        email,
        password,
        // redirect: false,
      });
    } catch (error) {
      console.log(error);
      enqueueSnackbar("There was an error", {
        variant: "error",
        autoHideDuration: 5000,
        anchorOrigin: {
          vertical: "top",
          horizontal: "right",
        },
      });
      return;
    }
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
            color="primary" //#13161b
            onClick={() => removeFromOrder(product.id)}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ))}

      {isAuthenticated ? (
        <>
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            <Typography variant="h6">
              Total de productos: {totalItems}
            </Typography>
          </Box>

          <Box mt={2}>
            <Typography id="quote-modal-description">
              Agrega un mensaje
            </Typography>
            <Controller
              control={control}
              name="message"
              render={({ field, fieldState: { invalid, error } }) => (
                <TextField
                  label=""
                  multiline
                  fullWidth
                  placeholder="Quisiera saber si..."
                  error={invalid}
                  helperText={error?.message && error.message}
                  variant="outlined"
                  rows={4}
                  inputProps={{
                    form: {
                      autocomplete: "off",
                    },
                  }}
                  InputProps={{
                    sx: {
                      borderRadius: "8px",
                      background: "#FFF",
                    },
                  }}
                  {...field}
                />
              )}
            />

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mt: 4,
                flexDirection: { xs: "column", md: "row" },
              }}
              gap={1}
            >
              {/* #13161b */}
              <Button variant="outlined" color="primary" onClick={clearOrder}>
                Vaciar Carrito
              </Button>

              <LoadingButton
                disabled={!isValid}
                loading={loading}
                variant="contained"
                onClick={handleSubmit(handleCheckout)}
              >
                Solicitar cotización
              </LoadingButton>
            </Box>
          </Box>
        </>
      ) : (
        <LoginContainer>
          <LoginForm onSubmit={onSignIn}>
            {({ loading, isValid }) => (
              <>
                <LoadingButton
                  loading={loading}
                  disabled={!isValid}
                  type="submit"
                  fullWidth
                  variant="contained"
                  // href="/auth/login"
                >
                  Iniciar sesión
                </LoadingButton>
              </>
            )}
          </LoginForm>
        </LoginContainer>
      )}
    </Box>
  );
};

export default CheckoutPage;
