"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useState } from "react";

const schema = yup.object().shape({
  email: yup.string().email("Email no válido").required("Email es requerido"),
  companyName: yup.string().nullable(),
  role: yup.string().oneOf(["user", "admin"]).required(),
});

const InvitationModal = ({ open, onClose, onSubmit }) => {
  const [submitting, setSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { isValid },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: { email: "", companyName: "", role: "user" },
  });

  const handleFormSubmit = async (values) => {
    setSubmitting(true);
    try {
      await onSubmit({
        email: values.email,
        companyName: values.companyName || undefined,
        role: values.role,
      });
      reset();
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Enviar invitación de registro</DialogTitle>
      <DialogContent sx={{ pt: "16px !important" }}>
        <Stack spacing={2} component="form" onSubmit={handleSubmit(handleFormSubmit)}>
          <Controller
            name="email"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                label="Email"
                fullWidth
                error={!!error}
                helperText={error?.message}
              />
            )}
          />
          <Controller
            name="companyName"
            control={control}
            render={({ field }) => (
              <TextField {...field} label="Nombre de empresa (opcional)" fullWidth />
            )}
          />
          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth>
                <InputLabel>Rol</InputLabel>
                <Select {...field} label="Rol">
                  <MenuItem value="user">Cliente</MenuItem>
                  <MenuItem value="admin">Administrador</MenuItem>
                </Select>
              </FormControl>
            )}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="outlined">
          Cancelar
        </Button>
        <LoadingButton
          loading={submitting}
          disabled={!isValid}
          variant="contained"
          onClick={handleSubmit(handleFormSubmit)}
        >
          Enviar invitación
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default InvitationModal;
