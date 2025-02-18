import { useState } from "react";
import { Grid, IconButton, InputAdornment, TextField } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  AlternateEmailOutlined,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { LoginSchema } from "../../../schemas/auth/login";
import { runIfFn } from "../../../utils/function";

const LoginForm = ({ onSubmit, loading, error, children }) => {
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm({
    resolver: yupResolver(LoginSchema),
    mode: "onChange",
  });

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const renderChildren = runIfFn(children, {
    loading,
    error,
    isValid,
  });

  return (
    <Grid component="form" onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Controller
            control={control}
            name="email"
            defaultValue=""
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
                    background: "#FFF",
                  },
                }}
                {...field}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sx={{ paddingTop: 1 }}>
          <Controller
            control={control}
            name="password"
            defaultValue=""
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
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                  sx: {
                    borderRadius: "8px",
                    background: "#FFF",
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

export default LoginForm