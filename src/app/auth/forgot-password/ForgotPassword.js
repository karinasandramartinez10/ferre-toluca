"use client";

import { LoadingButton } from "@mui/lab";
import { Grid } from "@mui/material";
import Image from "next/image";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { forgotPassword } from "../../../api/auth";
import useResponsive from "../../../hooks/use-responsive";
import { ForgotPasswordContainer } from "./ForgotPasswordContainer";
import { ForgotPasswordForm } from "./ForgotPasswordForm";

const ForgotPassword = () => {
  const isDesktop = useResponsive("up", "lg");
  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = async ({ email }) => {
    try {
      await forgotPassword({ email });
      enqueueSnackbar(
        "Se envió un correo para restablecer tu contraseña",
        {
          variant: "success",
          autoHideDuration: 5000,
          anchorOrigin: {
            vertical: "top",
            horizontal: "right",
          },
        }
      );
    } catch (error) {
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
        lg={5}
      >
        <ForgotPasswordContainer>
          <ForgotPasswordForm onSubmit={handleSubmit}>
            {({ loading, isValid }) => (
              <>
                <LoadingButton
                  loading={loading}
                  disabled={loading || !isValid}
                  type="submit"
                  fullWidth
                  // href="/auth/login"
                >
                  Restablecer contraseña
                </LoadingButton>
              </>
            )}
          </ForgotPasswordForm>
        </ForgotPasswordContainer>
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

export default ForgotPassword;
