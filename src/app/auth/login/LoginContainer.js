import { Box, Divider, Link, Typography } from "@mui/material";
// import useResponsive from "../../hooks/use-responsive";
import NextLink from 'next/link'

export const LoginContainer = ({ children }) => {
//   const isDesktop = useResponsive("up", "lg");

  return (
    <Box zIndex={2} margin={3}>
      <Typography variant="h3" fontWeight="600" align="center">
        Bienvenido de nuevo
      </Typography>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="baseline"
        gap={1}
        mb={1}
      >
        <Typography variant="subtitle1"> ¿No tienes una cuenta?</Typography>
        <NextLink
          passHref
          legacyBehavior
          href="/auth/signup"
          style={{
            display: "flex",
            alignItems: "center",
            // fontSize: isDesktop ? "1.25rem" : "1.125rem",
          }}
        >
          <Link>Crear cuenta</Link>
        </NextLink>
      </Box>
      <Box>
        <Box padding="8px 0px">
          <Divider variant="middle">
            O
          </Divider>
        </Box>
        {children}
      </Box>
    </Box>
  );
};
