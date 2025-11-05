import { Box, Typography, Button } from "@mui/material";
import HistoryIcon from "@mui/icons-material/History";
import { useRouter } from "next/navigation";

const EmptyQuotes = () => {
  const router = useRouter();

  return (
    <Box
      sx={{
        textAlign: "center",
        py: 8,
        px: 2,
        color: (theme) => theme.palette.text.secondary,
      }}
    >
      <HistoryIcon sx={{ fontSize: 64, mb: 2, color: "inherit" }} />
      <Typography variant="h6" gutterBottom>
        No tienes órdenes previas
      </Typography>
      <Typography variant="body2" sx={{ mb: 3 }}>
        Aún no has solicitado ninguna cotización. Empieza agregando productos a
        tu carrito.
      </Typography>
      <Button variant="contained" onClick={() => router.push("/")}>
        Ir al catálogo
      </Button>
    </Box>
  );
};

export default EmptyQuotes;
