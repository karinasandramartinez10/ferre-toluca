import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { Dropzone } from "../../../../components/Dropzone";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { LoadingButton } from "@mui/lab";
import UploadingMessage from "./UploadingMessage";

const BrandSchema = yup.object().shape({
  name: yup.string().required("El nombre es requerido"),
  image: yup.mixed().required("La imagen es requerida"),
});

const defaultValues = {
  name: "",
  image: null,
};

const BrandModal = ({
  open,
  onClose,
  onSubmit,
  loading,
  mode = "create",
  selectedBrand,
}) => {
  const [photo, setPhoto] = useState(null);

  const {
    control,
    handleSubmit,
    setValue,
    unregister,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(BrandSchema),
    mode: "onChange",
    defaultValues,
  });

  useEffect(() => {
    if (mode === "edit" && selectedBrand) {
      setValue("name", selectedBrand.name);
      if (selectedBrand.File?.path) {
        setValue("image", selectedBrand.File.path);
        setPhoto({
          preview: selectedBrand.File.path,
        });
      }
    }
  }, [mode, selectedBrand, setValue]);

  const handleRemoveFile = () => {
    unregister("image");
    URL.revokeObjectURL(photo?.preview);
    setPhoto(null);
  };

  const handleFormSubmit = (data) => {
    onSubmit(data);
    resetValues();
  };

  const resetValues = () => {
    reset(defaultValues);
    setPhoto(null);
  };

  const handleCloseModal = () => {
    resetValues();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleCloseModal} fullWidth maxWidth="md">
      <DialogTitle sx={{ fontWeight: 600 }}>
        {mode === "create" ? "Agregar Marca" : "Editar Marca"}
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
          {loading ? (
            <UploadingMessage />
          ) : (
            <Dropzone
              text="Arrastra o selecciona una imagen"
              preview
              setValue={setValue}
              photo={photo}
              setPhoto={setPhoto}
              onRemove={handleRemoveFile}
              loading={loading}
            />
          )}
          {errors.image && <Box color="error.main">{errors.image.message}</Box>}
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
          variant="contained"
          color="primary"
        >
          {mode === "create" ? "Agregar" : "Guardar Cambios"}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default BrandModal;
