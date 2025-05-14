"use client";

import {
  Typography,
  Button,
  TextField,
  Grid,
  InputAdornment,
  IconButton,
  Box,
  Link,
  Divider,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { signIn } from "next-auth/react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { registerUser } from "../../../api/auth";
import * as yup from "yup";
import { differenceInYears } from "date-fns";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import {
  AlternateEmailOutlined,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { useState } from "react";
import NextLink from "next/link";
import useResponsive from "../../../hooks/use-responsive";
import Image from "next/image";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { MuiTelInput } from "mui-tel-input";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";

const phoneRegExp = /^\+\d{9,15}$/; //TODO: add number international validation support
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;

const defaultFormValues = {
  email: "",
  name: "",
  lastname: "",
  password: "",
  confirmPassword: "",
  phoneNumber: null,
  dateOfBirth: null,
  agreeTerms: false,
};

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);

  const isDesktop = useResponsive("up", "lg");

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const SignUpSchema = yup.object().shape({
    name: yup.string().required("Nombre es obligatorio"),
    lastname: yup.string().required("Apellido es requerido"),
    email: yup
      .string()
      .email("Email no es válido")
      .required("Email es obligatorio"),
    dateOfBirth: yup
      .string()
      .nullable()
      .required("La fecha de nacimiento es obligatoria")
      .test(
        "birthday",
        "Para registrarse, debe tener al menos 18 años",
        (value) => differenceInYears(new Date(), new Date(value)) >= 18
      ),
    password: yup
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .matches(
        passwordRegex,
        "La contraseña debe tener al menos una mayúscula, una minúscula y un número"
      )
      // .transform((x) => (x === "" ? undefined : x))
      .required("Contraseña requerida"),
    confirmPassword: yup
      .string()
      .transform((x) => (x === "" ? undefined : x))
      .required("Se requiere confirmar contraseña")
      .oneOf([yup.ref("password")], "Las contraseñas deben coincidir"),
    phoneNumber: yup
      .string()
      .nullable()
      .required("Teléfono es requerido")
      .matches(phoneRegExp, "Teléfono no es válido"),
    agreeTerms: yup
      .bool()
      .test(
        "agreeTerms",
        "Para crear una cuenta debes aceptar nuestros Términos y Condiciones",
        (value) => value === true
      )
      .required(
        "Para crear una cuenta debes aceptar nuestros Términos y Condiciones"
      ),
  });

  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm({
    resolver: yupResolver(SignUpSchema),
    mode: "onChange",
    defaultValues: defaultFormValues,
  });

  const onSubmit = async ({
    name,
    lastname,
    email,
    password,
    phoneNumber,
    dateOfBirth,
  }) => {
    const regError = await registerUser({
      firstName: name.toLowerCase().trim(),
      lastName: lastname.toLowerCase().trim(),
      email,
      password,
      phoneNumber,
      birthDate: format(new Date(dateOfBirth), "yyyy-MM-dd"),
      role: "user",
    });

    if (regError) {
      enqueueSnackbar(
        `Hubo un error, contacta al administrador, Error: ${regError?.response?.data?.error}`,
        { variant: "error" }
      );
      return;
    }

    await signIn("credentials", { email, password, redirectTo: "/" });
    window.location.replace("/");
    router.replace("/");
    enqueueSnackbar("¡Bienvenido! Cuenta creada con éxito.", {
      variant: "success",
    });
  };

  return (
    <Grid container position="relative" mt={0} spacing={3}>
      <Grid
        item
        display="flex"
        flexDirection="column"
        alignItems="center"
        minHeight="100vh"
        justifyContent="center"
        xs={12}
        lg={5}
      >
        <Box zIndex={2} sx={{ padding: { xs: 3, md: 5 } }}>
          <Typography variant="h3" fontWeight="600" align="center">
            Comenzar
          </Typography>
          <Box
            display="flex"
            alignItems="baseline"
            justifyContent="center"
            gap={1}
            mb={1}
          >
            <Typography variant="subtitle1">Ya tengo una cuenta</Typography>
            <NextLink
              passHref
              legacyBehavior
              href="/auth/login"
              style={{
                display: "flex",
                alignItems: "center",
                fontSize: isDesktop ? "1.25rem" : "1.125rem",
              }}
            >
              <Link>Iniciar sesión</Link>
            </NextLink>
          </Box>
          <Box>
            <Box padding="8px 0px">
              <Divider variant="middle">O</Divider>
            </Box>
            {/* Form */}
            <Grid component="form" onSubmit={handleSubmit(onSubmit)}>
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

                <Grid item xs={12} md={6}>
                  <Controller
                    control={control}
                    name="name"
                    render={({ field, fieldState: { invalid, error } }) => (
                      <TextField
                        fullWidth
                        error={invalid}
                        helperText={error?.message && error.message}
                        label="Nombre"
                        variant="outlined"
                        {...field}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Controller
                    control={control}
                    name="lastname"
                    render={({ field, fieldState: { invalid, error } }) => (
                      <TextField
                        fullWidth
                        error={invalid}
                        helperText={error?.message && error.message}
                        label="Apellido"
                        variant="outlined"
                        {...field}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
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
                                {showPassword ? (
                                  <Visibility />
                                ) : (
                                  <VisibilityOff />
                                )}
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
                <Grid item xs={12} md={6}>
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
                                {showPassword ? (
                                  <Visibility />
                                ) : (
                                  <VisibilityOff />
                                )}
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
                <Grid item xs={12} md={6}>
                  <Controller
                    control={control}
                    name="dateOfBirth"
                    render={({
                      field: { onChange, value },
                      fieldState: { error },
                    }) => (
                      <LocalizationProvider
                        dateAdapter={AdapterDateFns}
                        adapterLocale={es}
                      >
                        <DatePicker
                          label="Fecha de nacimiento"
                          value={value}
                          onChange={onChange}
                          format="dd/MM/yyyy"
                          // defaultValue={null}
                          sx={{
                            background: "#FFF",
                            borderRadius: "8px",
                          }}
                          slotProps={{
                            textField: {
                              variant: "outlined",
                              error: !!error,
                              helperText: error?.message && error.message,
                              id: "dateOfBirth",
                              variant: "outlined",
                              placeholder: "MM/DD/YYYY",
                              fullWidth: true,
                              style: {
                                borderRadius: "8px",
                              },
                              sx: {
                                borderRadius: "8px",
                              },
                            },
                          }}
                        />
                      </LocalizationProvider>
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="phoneNumber"
                    control={control}
                    fullWidth
                    render={({
                      field: { value, onChange },
                      fieldState: { error },
                    }) => {
                      return (
                        <MuiTelInput
                          disableFormatting
                          defaultCountry="MX"
                          value={value}
                          onChange={onChange}
                          variant="outlined"
                          fullWidth
                          name="Teléfono"
                          error={!!error}
                          helperText={error?.message && error.message}
                          InputProps={{
                            sx: {
                              borderRadius: "8px",
                              background: "#FFF",
                            },
                          }}
                        />
                      );
                    }}
                  />
                </Grid>
                <Grid
                  item
                  display="flex"
                  xs={12}
                  sx={{
                    paddingLeft: "24px !important",
                    paddingTop: "8px !important",
                  }}
                >
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Controller
                          name="agreeTerms"
                          control={control}
                          render={({
                            field: { value, onChange, ...props },
                            fieldState: { error },
                          }) => (
                            <>
                              <Checkbox
                                inputProps={{
                                  "aria-label": "Notifications checkbox",
                                }}
                                checked={value}
                                onChange={(e) => onChange(e.target.checked)}
                                {...props}
                              />
                              <Box>
                                <Typography variant="body3">
                                  Acepto los{" "}
                                  <NextLink
                                    href="/service-terms"
                                    target="_blank"
                                    passHref
                                    legacyBehavior
                                    rel="noopener"
                                  >
                                    <Link>términos de servicio</Link>
                                  </NextLink>
                                </Typography>
                                {error && (
                                  <Typography
                                    sx={{ fontSize: "0.75rem" }}
                                    color="error"
                                  >
                                    {error.message}
                                  </Typography>
                                )}
                              </Box>{" "}
                            </>
                          )}
                        />
                      }
                    />
                  </FormGroup>
                </Grid>
              </Grid>
              <Button fullWidth type="submit" disabled={!isValid}>
                Registrarse
              </Button>
            </Grid>
          </Box>
        </Box>
      </Grid>

      {isDesktop && (
        <Grid
          item
          xs={0}
          lg={7}
          style={{
            position: isDesktop ? "relative" : "initial",
            overflow: isDesktop ? "hidden" : "auto",
          }}
        >
          <Image
            src={"/pexels-tools.jpg"}
            alt="Picture of the author"
            fill
            quality={100}
            style={{
              opacity: 0.8,
              objectFit: "cover",
            }}
          />
        </Grid>
      )}
    </Grid>
  );
};

export default SignUp;
