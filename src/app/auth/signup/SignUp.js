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
  Stack,
} from "@mui/material";
import { signIn } from "next-auth/react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { registerUser } from "../../../api/auth";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { SignUpSchema } from "../../../schemas/auth/signup";

import { AlternateEmailOutlined, Visibility, VisibilityOff } from "@mui/icons-material";
import { useState, useEffect } from "react";
import NextLink from "next/link";
import useResponsive from "../../../hooks/use-responsive";
import Image from "next/image";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { MuiTelInput } from "mui-tel-input";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import { useQuery } from "@tanstack/react-query";
import { validateInvitation } from "../../../api/invitations";
import { queryKeys } from "../../../constants/queryKeys";
import { Loading } from "../../../components/Loading";

const defaultFormValues = {
  email: "",
  name: "",
  lastname: "",
  password: "",
  confirmPassword: "",
  phoneNumber: null,
  dateOfBirth: null,
  companyName: "",
  agreeTerms: false,
};

const SignUp = ({ token }) => {
  const [showPassword, setShowPassword] = useState(false);

  const isDesktop = useResponsive("up", "lg");

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const { data: invitation, isLoading: validatingToken } = useQuery({
    queryKey: queryKeys.invitationValidation(token),
    queryFn: () => validateInvitation(token),
    enabled: !!token,
    staleTime: Infinity,
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { isValid },
  } = useForm({
    resolver: yupResolver(SignUpSchema),
    mode: "onChange",
    defaultValues: defaultFormValues,
  });

  // Pre-fill form when invitation data arrives
  useEffect(() => {
    if (invitation?.valid) {
      const prefill = invitation.prefill;
      reset({
        ...defaultFormValues,
        email: invitation.email || "",
        name: prefill?.firstName || "",
        lastname: prefill?.lastName || "",
        phoneNumber: prefill?.phoneNumber || null,
        companyName: prefill?.companyName || invitation.companyName || "",
      });
    }
  }, [invitation, reset]);

  const onSubmit = async ({
    name,
    lastname,
    email,
    password,
    phoneNumber,
    dateOfBirth,
    companyName,
    agreeTerms,
  }) => {
    const regError = await registerUser({
      invitationToken: token,
      firstName: name.toLowerCase().trim(),
      lastName: lastname.toLowerCase().trim(),
      email,
      password,
      phoneNumber,
      birthDate: format(new Date(dateOfBirth), "yyyy-MM-dd"),
      companyName: companyName || undefined,
      agreeTerms,
    });

    if (regError) {
      enqueueSnackbar(
        `Hubo un error, contacta al administrador, Error: ${regError?.response?.data?.error}`,
        { variant: "error" }
      );
      return;
    }

    enqueueSnackbar("¡Bienvenido! Cuenta creada con éxito.", {
      variant: "success",
    });
    await signIn("credentials", { email, password, redirectTo: "/" });
  };

  if (validatingToken) {
    return <Loading />;
  }

  if (!invitation?.valid) {
    return (
      <Box
        sx={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 3,
        }}
      >
        <Stack spacing={2} alignItems="center" textAlign="center" maxWidth={400}>
          <Typography variant="h5" fontWeight={600}>
            Invitación inválida o expirada
          </Typography>
          <Typography color="text.secondary">
            Este enlace de registro ya no es válido. Contacta al administrador para solicitar una
            nueva invitación.
          </Typography>
          <Button variant="contained" component={NextLink} href="/contact">
            Contáctanos
          </Button>
        </Stack>
      </Box>
    );
  }

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
          {invitation?.role && (
            <Typography variant="body2" align="center" color="text.secondary" sx={{ mt: 0.5 }}>
              {invitation.role === "admin"
                ? "Te han invitado como administrador"
                : "Te han invitado como cliente"}
            </Typography>
          )}
          <Box display="flex" alignItems="baseline" justifyContent="center" gap={1} mb={1}>
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
                        type="email"
                        error={invalid}
                        helperText={error?.message && error.message}
                        label="Correo electrónico"
                        variant="outlined"
                        InputProps={{
                          readOnly: !!invitation?.email,
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton aria-label="email">
                                <AlternateEmailOutlined />
                              </IconButton>
                            </InputAdornment>
                          ),
                          sx: {
                            borderRadius: "8px",
                            backgroundColor: invitation?.email ? "#f5f5f5" : "#FFF",
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
                <Grid item xs={12} md={6}>
                  <Controller
                    control={control}
                    name="dateOfBirth"
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
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
                    render={({ field: { value, onChange }, fieldState: { error } }) => {
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
                <Grid item xs={12}>
                  <Controller
                    control={control}
                    name="companyName"
                    render={({ field }) => (
                      <TextField
                        fullWidth
                        label="Nombre de empresa (opcional)"
                        variant="outlined"
                        InputProps={{
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
                                    href="/terms-conditions"
                                    target="_blank"
                                    passHref
                                    legacyBehavior
                                    rel="noopener"
                                  >
                                    <Link>Términos y Condiciones</Link>
                                  </NextLink>{" "}
                                  y el{" "}
                                  <NextLink
                                    href="/privacy-statement"
                                    target="_blank"
                                    passHref
                                    legacyBehavior
                                    rel="noopener"
                                  >
                                    <Link>Aviso de Privacidad</Link>
                                  </NextLink>
                                </Typography>
                                {error && (
                                  <Typography sx={{ fontSize: "0.75rem" }} color="error">
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
