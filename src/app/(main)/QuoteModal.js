import { yupResolver } from "@hookform/resolvers/yup";
import { Close } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
  Box,
  IconButton,
  Modal,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useSession } from "next-auth/react";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { createQuote } from "../../api/quote";

const defaultFormValues = {
  message: "",
};

const QuoteSchema = yup.object().shape({
  message: yup.string().required("El mensaje es requerido"),
});

export const QuoteModal = ({ open, onClose, product }) => {
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const { data } = useSession();

  const {
    control,
    handleSubmit,
    formState: { isValid },
    reset,
  } = useForm({
    resolver: yupResolver(QuoteSchema),
    mode: "onChange",
    defaultValues: defaultFormValues,
  });

  const { enqueueSnackbar } = useSnackbar();

  const onSubmit = async (values) => {
    setLoading(true);
    try {
      const requestBody = {
        message: values.message,
        ProductId: product.id,
      };
      await createQuote(requestBody, data.user.access_token);
      enqueueSnackbar(
        "Solicitud enviada. Pronto te contactaremos a tu correo o teléfono",
        {
          variant: "success",
          autoHideDuration: 5000,
          anchorOrigin: {
            vertical: "top",
            horizontal: "right",
          },
        }
      );
      reset();
      setLoading(false);
      onClose()
    } catch (error) {
      setLoading(false);
      enqueueSnackbar("Hubo un error al solicitar la cotización", {
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

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="Quote"
      aria-describedby="quote-message"
    >
      <Box
        sx={(theme) => ({
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          // border: `1px solid #f67003`,
          borderRadius: "8px",
          boxShadow: 24,
          p: 4,
          width: !fullScreen ? "500px" : "100%",
        })}
      >
        <Stack gap={2}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography id="quote-modal-title" variant="h4" component="h2">
              {product?.name}
            </Typography>
            <IconButton
              size="large"
              edge="start"
              aria-label="menu"
              onClick={onClose}
              color="primary"
              // sx={{ color: "#FFF"}}
            >
              <Close />
            </IconButton>
          </Box>
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
        </Stack>
        <LoadingButton
          disabled={!isValid}
          loading={loading}
          onClick={handleSubmit(onSubmit)}
          fullWidth
        >
          Solicitar cotización
        </LoadingButton>
      </Box>
    </Modal>
  );
};
