import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import UploadingMessage from "../app/(admin)/admin/brands/UploadingMessage";

const Schema = yup.object().shape({
  name: yup.string().required("El nombre es requerido"),
});

const defaultValues = {
  name: "",
};

const ActionModal = ({
  open,
  onClose,
  onSubmit,
  loading,
  mode = "create",
  selected,
}) => {
  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(Schema),
    mode: "onChange",
    defaultValues,
  });

  useEffect(() => {
    if (mode === "edit" && selected) {
      setValue("name", selected.name);
    }
  }, [mode, selected, setValue]);

  const handleFormSubmit = (data) => {
    onSubmit(data);
    resetValues();
  };

  const resetValues = () => {
    reset(defaultValues);
  };

  const handleCloseModal = () => {
    resetValues();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleCloseModal} fullWidth maxWidth="md">
      <DialogTitle sx={{ fontWeight: 600 }}>
        {mode === "create" ? "Agregar Categoría" : "Editar Categoría"}
      </DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} mt={1}>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Nombre"
                fullWidth
                error={!!errors.name}
                helperText={errors.name?.message}
                disabled={loading}
              />
            )}
          />
          {loading && <UploadingMessage />}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleCloseModal}
          variant="outlined"
          disabled={loading}
        >
          Cancelar
        </Button>
        <LoadingButton
          onClick={handleSubmit(handleFormSubmit)}
          loading={loading}
          disabled={loading || !isValid}
          variant="contained"
          color="primary"
        >
          {mode === "create" ? "Agregar" : "Guardar Cambios"}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default ActionModal;
