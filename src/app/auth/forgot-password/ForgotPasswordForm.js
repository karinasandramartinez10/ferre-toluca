import { AlternateEmailOutlined } from "@mui/icons-material";
import { Grid, IconButton, InputAdornment, TextField } from "@mui/material";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { runIfFn } from "../../../utils/function";
import { yupResolver } from "@hookform/resolvers/yup";

const defaultFormValues = {
  email: "",
};

const ForgotPasswordSchema = yup.object().shape({
  email: yup
    .string()
    .email("Email no es válido")
    .required("Email es obligatorio"),
});

export const ForgotPasswordForm = ({ onSubmit, children, loading, error }) => {
  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm({
    resolver: yupResolver(ForgotPasswordSchema),
    mode: "onChange",
    defaultValues: defaultFormValues,
  });

  const renderChildren = runIfFn(children, {
    loading,
    error,
    isValid,
  });

  return (
    <Grid component="form" onSubmit={handleSubmit(onSubmit)} mt={4}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Controller
            control={control}
            name="email"
            render={({ field, fieldState: { invalid, error } }) => (
              <TextField
                fullWidth
                error={invalid}
                helperText={error?.message && error.message}
                label="Correo electrónico"
                variant="outlined"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton aria-label="email">
                        <AlternateEmailOutlined />
                      </IconButton>
                    </InputAdornment>
                  ),
                  sx: {
                    borderRadius: "8px",
                    backgroundColor: "#FFF",
                  },
                }}
                {...field}
              />
            )}
          />
        </Grid>
        <Grid item xs={12}>
          {renderChildren}
        </Grid>
      </Grid>
    </Grid>
  );
};
