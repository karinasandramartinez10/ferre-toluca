import { yupResolver } from "@hookform/resolvers/yup";
import {
  AlternateEmailOutlined,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { Grid, IconButton, InputAdornment, TextField } from "@mui/material";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { runIfFn } from "../../../utils/function";

const defaultFormValues = {
  password: "",
  confirmPassword: "",
};

const ResetPasswordSchema = yup.object().shape({
  password: yup
    .string()
    .transform((x) => (x === "" ? undefined : x))
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .required("Contraseña requerida"),
  confirmPassword: yup
    .string()
    .transform((x) => (x === "" ? undefined : x))
    .required("Se requiere confirmar contraseña")
    .oneOf([yup.ref("password")], "Las contraseñas deben coincidir"),
});

export function ResetPasswordForm({ onSubmit, children, loading, error }) {
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm({
    resolver: yupResolver(ResetPasswordSchema),
    mode: "onChange",
    defaultValues: defaultFormValues,
  });

  const renderChildren = runIfFn(children, {
    loading,
    error,
    isValid,
  });

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  return (
    <Grid component="form" onSubmit={handleSubmit(onSubmit)} mt={4}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Controller
            control={control}
            name="password"
            render={({ field, fieldState: { invalid, error } }) => (
              <TextField
                fullWidth
                error={invalid}
                helperText={error?.message && error.message}
                label="Contraseña"
                variant="outlined"
                type={showPassword ? "text" : "password"}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        // onMouseDown={handleMouseDownPassword}
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
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
          <Controller
            control={control}
            name="confirmPassword"
            render={({ field, fieldState: { invalid, error } }) => (
              <TextField
                fullWidth
                error={invalid}
                helperText={error?.message && error.message}
                label="Confirmar contraseña"
                variant="outlined"
                type={showPassword ? "text" : "password"}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        // onMouseDown={handleMouseDownPassword}
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
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
}
