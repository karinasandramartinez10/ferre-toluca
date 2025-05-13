import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  MenuItem,
  Select,
  TextField,
  Typography,
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
  title = "",
  optionTitle = "",
  open,
  onClose,
  onSubmit,
  loading,
  mode = "create",
  selected,
  options = [],
  option,
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

      const getRelationKey = (option) => {
        const map = {
          categoryId: "category",
          subcategoryId: "subCategory",
        };
        return map[option] || null;
      };

      const relationKey = getRelationKey(option);
      const relatedObject = selected[relationKey];
      setValue(option, relatedObject?.id || "");
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
        {mode === "create" ? `Agregar ${title}` : `Editar ${title}`}
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
          {options.length > 0 && (
            <>
              <Typography fontWeight={600}>{optionTitle}</Typography>
              <Controller
                control={control}
                name={option}
                render={({ field }) => (
                  <FormControl sx={{ minWidth: 120 }} size="small">
                    <Select
                      {...field}
                      value={field.value || ""}
                      fullWidth
                      sx={{ background: "#FFF" }}
                    >
                      {options.map((option) => (
                        <MenuItem key={option.id} value={option.id}>
                          {option.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
            </>
          )}
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
