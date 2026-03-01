"use client";

import { Box, Divider, Link, Stack, Typography } from "@mui/material";
import NextLink from "next/link";

const LoginContainer = ({ children }) => {
  return (
    <Box zIndex={2} margin={3}>
      <Stack gap={1}>
        <Typography variant="h3" fontWeight="600" align="center">
          Bienvenido de nuevo
        </Typography>

        <Box display="flex" justifyContent="center" alignItems="baseline" gap={1}>
          <Typography variant="body1"> ¿No tienes una cuenta?</Typography>
          <Link component={NextLink} href="/auth/signup">
            Crear cuenta
          </Link>
        </Box>
        <Box display="flex" justifyContent="center" alignItems="baseline" gap={1} mb={1}>
          <Typography variant="body1"> ¿Olvidaste tu contraseña?</Typography>
          <Link component={NextLink} href="/auth/forgot-password" replace>
            Restablécela
          </Link>
        </Box>
      </Stack>

      <Box>
        <Box padding="8px 0px">
          <Divider variant="middle">O</Divider>
        </Box>
        {children}
      </Box>
    </Box>
  );
};

export default LoginContainer;
