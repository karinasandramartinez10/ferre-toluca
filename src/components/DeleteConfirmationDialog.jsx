import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";

const DeleteConfirmationDialog = ({
  open,
  onClose,
  onConfirm,
  loading,
  title,
  description,
  confirmColor = "primary",
}) => {
  return (
    <Dialog open={open} onClose={!loading ? onClose : null} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 600 }}>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{description}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined" disabled={loading}>
          Cancelar
        </Button>
        <LoadingButton
          onClick={onConfirm}
          loading={loading}
          variant="contained"
          color={confirmColor}
        >
          Eliminar
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmationDialog;
