"use client";

import { Grid, Typography } from "@mui/material";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { ResetPasswordContainer } from "./ResetPasswordContainer";
import useResponsive from "../../../hooks/use-responsive";
import { ResetPasswordForm } from "./ResetPasswordForm";
import { LoadingButton } from "@mui/lab";
import { resetPassword } from "../../../api/auth";
import { useSnackbar } from "notistack";
import { useState } from "react";

export const ResetPassword = () => {
  const [redirectCountdown, setRedirectCountdown] = useState(null);

  const searchParams = useSearchParams();
  const isDesktop = useResponsive("up", "lg");
  const router = useRouter();
  const token = searchParams.get("token");

  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = async ({ password }) => {
    try {
      await resetPassword({ token, newPassword: password });
      enqueueSnackbar("Se restableció tu contraseña correctamente", {
        variant: "success",
        autoHideDuration: 5000,
        anchorOrigin: {
          vertical: "top",
          horizontal: "right",
        },
      });
      setRedirectCountdown(5);
      setTimeout(() => {
        router.push("/auth/login");
      }, 5000);
    } catch (error) {
      console.log(error);
      enqueueSnackbar(error, {
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
        lg={5}
      >
        <ResetPasswordContainer>
          <ResetPasswordForm onSubmit={handleSubmit}>
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
                  Restablecer contraseña
                </LoadingButton>
                {redirectCountdown && (
                  <Grid item xs={12}>
                    <Typography variant="h6" align="center">
                      Serás reedirigido a la página de inicio de sesión en{" "}
                      {redirectCountdown} segundos...
                    </Typography>
                  </Grid>
                )}
              </>
            )}
          </ResetPasswordForm>
        </ResetPasswordContainer>
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
              opacity: 0.4,
              objectFit: "cover",
            }}
          />
        </Grid>
      )}
    </Grid>
  );
};
