"use client";

import { Grid } from "@mui/material";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { useSnackbar } from "notistack";
import { LoginContainer } from "./LoginContainer";
import { LoginForm } from "./LoginForm";
import { LoadingButton } from "@mui/lab";

const Login = () => {
  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = async ({ email, password }) => {
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
