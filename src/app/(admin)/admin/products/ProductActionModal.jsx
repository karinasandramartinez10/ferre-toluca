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
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { Dropzone } from "../../../../components/Dropzone";
import UploadingMessage from "../brands/UploadingMessage";
import {
  getSelectOptions,
  multiLineFields,
  selectFields,
  textFields,
} from "./constants";

const Schema = yup.object().shape({
  name: yup.string().required("El nombre es requerido"),
  description: yup.string().required("La descripción es requerida"),
  code: yup.string().required("El código es requerido"),
  brandId: yup.string().required("La marca es requerida"),
  categoryId: yup.string().required("La categoría es requerida"),
  subCategoryId: yup.string().required("La subcategoría es requerida"),
  specifications: yup.string(),
  color: yup.string(),
  size: yup.string(),
});

const defaultValues = {
  name: "",
  code: "",
  color: "",
  size: "",
  description: "",
  specifications: "",
  brandId: "",
  categoryId: "",
  subCategoryId: "",
  typeId: "",
  image: null,
};

const ProductActionModal = ({
  title = "",
  open,
  onClose,
  onSubmit,
  fetchData,
  loading,
  mode = "create",
  selected,
  brands = [],
  categories = [],
  subcategories = [],
  types = [],
}) => {
  const [photo, setPhoto] = useState(null);

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
      setValue("code", selected.code || "");
      setValue("color", selected.color || "");
      setValue("size", selected.size || "");
      setValue("description", selected.description || "");
      setValue("specifications", selected.specifications || "");
      setValue("brandId", selected.brand?.id || "");
      setValue("categoryId", selected.category?.id || "");
      setValue("subCategoryId", selected.subCategory?.id || "");
      setValue("typeId", selected.type?.id || "");

      const existingImage =
        selected.Files?.length > 0 ? selected.Files[0].path : null;
      setPhoto(existingImage ? { preview: existingImage } : null);
    }
  }, [mode, selected, setValue]);

  const handleFormSubmit = async (data) => {
    const formData = new FormData();
  
    if (data.name) formData.append("name", data.name);
    if (data.code) formData.append("code", data.code);
    if (data.color) formData.append("color", data.color);
    if (data.size) formData.append("size", data.size);
    if (data.description) formData.append("description", data.description);
    if (data.specifications) formData.append("specifications", data.specifications);
  
    if (data.brandId) formData.append("brandId", data.brandId);
    if (data.categoryId) formData.append("categoryId", data.categoryId);
    if (data.subCategoryId) formData.append("subCategoryId", data.subCategoryId);
    if (data.typeId) formData.append("typeId", data.typeId);
  
    if (photo) {
      formData.append("image", photo);
    }
  
    await onSubmit(formData);
    await fetchData();
    resetValues();
  };

  const resetValues = () => {
    reset(defaultValues);
  };

  const handleCloseModal = () => {
    resetValues(defaultValues);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleCloseModal} fullWidth maxWidth="md">
      <DialogTitle sx={{ fontWeight: 600 }}>
        {mode === "create" ? `Agregar ${title}` : `Editar ${title}`}
      </DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} mt={1}>
          {textFields.map(({ name, label }) => (
            <Controller
              key={name}
              name={name}
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label={label}
                  fullWidth
                  error={!!errors[name]}
                  helperText={errors[name]?.message}
                  disabled={loading}
                />
              )}
            />
          ))}

          {multiLineFields.map(({ name, label }) => (
            <Controller
              key={name}
              name={name}
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label={label}
                  fullWidth
                  multiline
                  minRows={3}
                  error={!!errors[name]}
                  helperText={errors[name]?.message}
                  disabled={loading}
                />
              )}
            />
          ))}

          {selectFields.map(({ label, name }) => (
            <Box key={name}>
              <Typography fontWeight={600}>{label}</Typography>
              <Controller
                control={control}
                name={name}
                render={({ field }) => (
                  <FormControl sx={{ minWidth: 120 }} size="small" fullWidth>
                    <Select {...field} value={field.value || ""}>
                      {getSelectOptions(
                        name,
                        brands,
                        categories,
                        subcategories,
                        types
                      ).map((option) => (
                        <MenuItem key={option.id} value={option.id}>
                          {option.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
            </Box>
          ))}

          <Dropzone
            text="Arrastra o escoge una nueva imagen"
            preview
            setValue={setValue}
            photo={photo}
            setPhoto={setPhoto}
            onRemove={() => setPhoto(null)}
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

export default ProductActionModal;
