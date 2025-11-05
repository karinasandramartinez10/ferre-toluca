"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

export default function DeleteConfirmDialog({
  open,
  title = "Eliminar",
  description,
  warning,
  onCancel,
  onConfirm,
  loading = false,
}) {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      fullWidth
      maxWidth="xs"
      aria-labelledby="delete-title"
      aria-describedby="delete-desc"
    >
      <DialogTitle id="delete-title">{title}</DialogTitle>
      <DialogContent>
        <Typography id="delete-desc">{description}</Typography>
        {warning}
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onCancel} disabled={loading}>
          Cancelar
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={onConfirm}
          disabled={loading}
        >
          Eliminar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
