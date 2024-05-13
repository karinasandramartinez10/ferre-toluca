import { Box, Typography } from "@mui/material";

export const ForgotPasswordContainer = ({ children }) => {
  return (
    <Box zIndex={2} sx={{ padding: { xs: 3, md: 5 } }}>
      <Typography variant="h3" fontWeight="600" align="center">
        ¿Olvidaste contraseña?
      </Typography>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="baseline"
        gap={1}
        mb={1}
      >
        <Typography variant="body1">
          No te preocupes, te enviaremos las instrucciones para restablerla
        </Typography>
      </Box>
      {children}
    </Box>
  );
};
