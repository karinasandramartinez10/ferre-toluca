import { Box, Button, Stack, Typography } from "@mui/material";
import { useRouter } from "next/navigation";

export const ErrorUI = ({ main = false }) => {
  const router = useRouter();
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
          Ha ocurrido un error en el servidor
        </Typography>
        <Box>
          <Button href="/" onClick={() => router.push("/")}>
            {main ? "Recargar la página" : "Volver a la página principal"}
          </Button>
        </Box>
      </Stack>
    </Box>
  );
};
