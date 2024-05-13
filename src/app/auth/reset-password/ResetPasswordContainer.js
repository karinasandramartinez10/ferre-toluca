import { Box, Typography } from "@mui/material";

export const ResetPasswordContainer = ({ children }) => {
  return (
    <Box zIndex={2} sx={{ padding: { xs: 3, md: 5 } }}>
      <Typography variant="h3" fontWeight="600" align="center">
        Crea una nueva contraseña
      </Typography>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="baseline"
        gap={1}
        mb={1}
      />
      {children}
    </Box>
  );
};
