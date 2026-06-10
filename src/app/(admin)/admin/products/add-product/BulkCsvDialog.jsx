"use client";

import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack } from "@mui/material";
import { AddProductBanner } from "./AddProductBanner";
import BulkCSVUpload from "./BulkCSVUpload";

const BulkCsvDialog = ({ open, onClose }) => (
  <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
    <DialogTitle sx={{ fontWeight: 600 }}>Importar productos por CSV</DialogTitle>
    <DialogContent>
      <Stack spacing={3} sx={{ mt: 1 }}>
        <AddProductBanner variant="csv" />
        <BulkCSVUpload />
      </Stack>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} variant="outlined">
        Cerrar
      </Button>
    </DialogActions>
  </Dialog>
);

export default BulkCsvDialog;
