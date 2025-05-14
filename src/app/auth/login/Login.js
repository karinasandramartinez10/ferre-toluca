"use client";

import { Grid } from "@mui/material";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { useSnackbar } from "notistack";
import { LoadingButton } from "@mui/lab";
import LoginContainer from "./LoginContainer";
import LoginForm from "./LoginForm";
import { useRouter } from "next/navigation";

const Login = () => {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  const handleSubmit = async ({ email, password }) => {
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      enqueueSnackbar("Correo o contraseña incorrectos", {
        variant: "error",
      });
      return;
    }

    router.replace("/");
    enqueueSnackbar("¡Bienvenido de nuevo!", { variant: "success" });
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
      >
        <LoginContainer>
          <LoginForm onSubmit={handleSubmit}>
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
        <Image
          src={"/pexels-tools.jpg"}
          alt="Picture of the author"
          fill
          quality={100}
          style={{
            opacity: 0.4,
            objectFit: "cover",
          }}
        />
      </Grid>
    </Grid>
  );
};

export default Login;
