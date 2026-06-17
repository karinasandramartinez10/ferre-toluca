"use client";

import { useState } from "react";
import { Box, TextField, Typography, Stack, Grid } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { MuiTelInput } from "mui-tel-input";
import { useSnackbar } from "notistack";
import { submitContactRequest } from "../../../api/contactRequests";

const phoneRegExp = /^\+\d{9,15}$/;

const schema = yup.object().shape({
  firstName: yup.string().required("Nombre es requerido"),
  lastName: yup.string().required("Apellido es requerido"),
  email: yup.string().email("Email no válido").required("Email es requerido"),
  phoneNumber: yup
    .string()
    .nullable()
    .transform((v) => (v === "" ? null : v))
    .matches(phoneRegExp, { message: "Teléfono no válido", excludeEmptyString: true }),
  companyName: yup.string().nullable(),
  message: yup.string().nullable(),
});

const ContactPage = () => {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const {
    control,
    handleSubmit,
    formState: { isValid },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      companyName: "",
      message: "",
    },
  });

  const onSubmit = async (values) => {
    setSubmitting(true);
    try {
      await submitContactRequest({
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        email: values.email.trim(),
        phoneNumber: values.phoneNumber || undefined,
        companyName: values.companyName || undefined,
        message: values.message || undefined,
      });
      setSubmitted(true);
      reset();
      enqueueSnackbar("Solicitud recibida. Nos pondremos en contacto contigo.", {
        variant: "success",
        autoHideDuration: 5000,
      });
    } catch (err) {
      const status = err?.status;
      let msg;
      if (status === 429) {
        msg = "Demasiadas solicitudes. Intenta más tarde.";
      } else if (status === 409) {
        msg = err?.message;
      } else {
        msg = err?.message || "Error al enviar solicitud";
      }
      enqueueSnackbar(msg, { variant: status === 409 ? "warning" : "error" });
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <Box sx={{ textAlign: "center", py: 8 }}>
        <Typography variant="h4" fontWeight={600} gutterBottom>
          Solicitud enviada
        </Typography>
        <Typography color="text.secondary">
          Nos pondremos en contacto contigo pronto. Revisa tu correo electrónico.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", py: 4, px: 2 }}>
      <Stack spacing={2} sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={600}>
          Contáctanos
        </Typography>
        <Typography color="text.secondary">
          ¿Te interesa ser cliente? Llena el formulario y nos pondremos en contacto contigo para
          coordinar los detalles.
        </Typography>
      </Stack>

      <Grid container spacing={2} component="form" onSubmit={handleSubmit(onSubmit)}>
        <Grid item xs={12} md={6}>
          <Controller
            name="firstName"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                label="Nombre"
                fullWidth
                error={!!error}
                helperText={error?.message}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Controller
            name="lastName"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                label="Apellido"
                fullWidth
                error={!!error}
                helperText={error?.message}
              />
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <Controller
            name="email"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                label="Correo electrónico"
                type="email"
                fullWidth
                error={!!error}
                helperText={error?.message}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Controller
            name="phoneNumber"
            control={control}
            render={({ field: { value, onChange }, fieldState: { error } }) => (
              <MuiTelInput
                disableFormatting
                defaultCountry="MX"
                value={value}
                onChange={onChange}
                variant="outlined"
                fullWidth
                label="Teléfono (opcional)"
                error={!!error}
                helperText={error?.message}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Controller
            name="companyName"
            control={control}
            render={({ field }) => <TextField {...field} label="Empresa (opcional)" fullWidth />}
          />
        </Grid>
        <Grid item xs={12}>
          <Controller
            name="message"
            control={control}
            render={({ field }) => (
              <TextField {...field} label="Mensaje (opcional)" fullWidth multiline rows={3} />
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <LoadingButton
            type="submit"
            variant="contained"
            fullWidth
            loading={submitting}
            disabled={!isValid}
          >
            Enviar solicitud
          </LoadingButton>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ContactPage;
