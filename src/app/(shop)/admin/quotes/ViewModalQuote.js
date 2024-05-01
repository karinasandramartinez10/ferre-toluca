import { Close, Email, Phone } from "@mui/icons-material";
import {
  Box,
  Button,
  IconButton,
  Modal,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

export const ViewModalQuote = ({ open, onClose, quote }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const handleCall = () => {
    window.location.href = "tel:" + quote?.User?.phoneNumber;
  };

  const handleEmail = () => {
    window.location.href = `mailto:${
      quote?.User?.email
    }?subject=${encodeURIComponent("Cotización")}&body=${encodeURIComponent(
      `Hola ${quote?.User?.firstName}`
    )}`;
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="Quote"
      aria-describedby="quote-message"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          border: "1px solid #f67003",
          borderRadius: "8px",
          boxShadow: 24,
          p: 4,
          width: !fullScreen ? "500px" : "100%",
        }}
      >
        <Stack>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography id="quote-modal-title" variant="h3" component="h2">
              Información de cotización
            </Typography>
            <IconButton
              size="large"
              edge="start"
              aria-label="menu"
              onClick={onClose}
              color="primary"
            >
              <Close />
            </IconButton>
          </Box>
          <Stack gap={2}>
            <Typography variant="h5"></Typography>
            <Stack gap={1}>
              <Typography>
                <span style={{ fontWeight: 700 }}>Producto: </span>
                {quote?.Product?.name}
              </Typography>
              <Typography>
                <span style={{ fontWeight: 700 }}>Nombre: </span>
                {quote?.User?.firstName} {quote?.User?.lastName}
              </Typography>
              <Typography>
                <span style={{ fontWeight: 700 }}>Correo: </span>
                {quote?.User?.email}
              </Typography>
              <Typography>
                <span style={{ fontWeight: 700 }}>Número telefónico: </span>
                {quote?.User?.phoneNumber}
              </Typography>
              <Typography>
                <span style={{ fontWeight: 700 }}>Mensaje: </span>
                {quote?.message}
              </Typography>
              <Box
                display="flex"
                gap={1}
                width="100%"
                justifyContent="space-between"
              >
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={handleCall}
                  startIcon={<Phone />}
                >
                  Llamar
                </Button>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={handleEmail}
                  startIcon={<Email />}
                >
                  Correo
                </Button>
              </Box>
            </Stack>
          </Stack>
        </Stack>
      </Box>
    </Modal>
  );
};
