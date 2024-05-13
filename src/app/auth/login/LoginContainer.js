import { Box, Divider, Link, Stack, Typography } from "@mui/material";
// import useResponsive from "../../hooks/use-responsive";
import NextLink from "next/link";

export const LoginContainer = ({ children }) => {
  //   const isDesktop = useResponsive("up", "lg");

  return (
    <Box zIndex={2} margin={3}>
      <Stack gap={1}>
        <Typography variant="h3" fontWeight="600" align="center">
          Bienvenido de nuevo
        </Typography>

        <Box
          display="flex"
          justifyContent="center"
          alignItems="baseline"
          gap={1}
        >
          <Typography variant="body1"> ¿No tienes una cuenta?</Typography>
          <NextLink
            passHref
            legacyBehavior
            href="/auth/signup"
            onClick={() => router.push("/")}
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <Link>Crear cuenta</Link>
          </NextLink>
        </Box>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="baseline"
          gap={1}
          mb={1}
        >
          <Typography variant="body1"> ¿Olvidaste tu contraseña?</Typography>
          <NextLink
            passHref
            legacyBehavior
            href="/auth/forgot-password"
            replace
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <Link>Restablécela</Link>
          </NextLink>
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
