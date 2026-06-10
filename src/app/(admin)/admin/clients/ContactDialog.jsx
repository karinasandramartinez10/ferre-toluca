"use client";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";
import { Email, Phone } from "@mui/icons-material";

const ContactDialog = ({ open, onClose, request, onConfirm }) => {
  const fullName = `${request.firstName} ${request.lastName}`.trim();
  const phone = request.phoneNumber ? request.phoneNumber.replace(/\s+/g, "") : null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ fontWeight: 600 }}>Contactar a {fullName}</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Comunícate por teléfono o correo. Cuando lo hayas contactado, márcalo como contactado para
          avanzar el seguimiento.
        </Typography>
        <Stack spacing={1.5}>
          <Button
            component="a"
            href={phone ? `tel:${phone}` : undefined}
            disabled={!phone}
            startIcon={<Phone />}
            variant="outlined"
            fullWidth
            sx={{ justifyContent: "flex-start", textTransform: "none" }}
          >
            {phone ? `Llamar ${request.phoneNumber}` : "Sin teléfono"}
          </Button>
          <Button
            component="a"
            href={`mailto:${request.email}`}
            startIcon={<Email />}
            variant="outlined"
            fullWidth
            sx={{ justifyContent: "flex-start", textTransform: "none", wordBreak: "break-all" }}
          >
            Enviar correo a {request.email}
          </Button>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} variant="text" color="inherit">
          Volver
        </Button>
        <Button onClick={onConfirm} variant="contained">
          Marcar como contactado
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ContactDialog;
