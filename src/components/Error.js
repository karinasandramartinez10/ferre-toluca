import { Box, Button, Stack, Typography } from "@mui/material";
import Link from "next/link";

export const ErrorUI = ({ onRetry, message, href }) => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="calc(100vh - 200px)"
      sx={{
        flexDirection: { xs: "column", sm: "row" },
      }}
    >
      <Stack gap={2} alignItems="center">
        <Typography variant="h3" component="h1" textAlign="center">
          {message ?? "Ha ocurrido un error en el servidor"}
        </Typography>
        <Box>
          {/* Client */}
          {onRetry ? (
            <Button onClick={onRetry} variant="contained">
              Recargar
            </Button>
          ) : href ? (
            // SSR
            <Button component={Link} href={href} variant="contained">
              Recargar
            </Button>
          ) : null}
        </Box>
      </Stack>
    </Box>
  );
};
