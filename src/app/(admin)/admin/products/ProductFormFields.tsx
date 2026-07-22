import {
  Autocomplete,
  Box,
  FormControl,
  FormControlLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { Controller } from "react-hook-form";
import type { Control, FieldErrors, UseFormGetValues, UseFormSetValue } from "react-hook-form";
import { Dropzone } from "../../../../components/Dropzone";
import type { PhotoPreview } from "../../../../types/ui";
import {
  getSelectOptions,
  measureFields,
  multiLineFields,
  priceFields,
  selectFields,
  textFields,
} from "./constants";
import { sectionTitleSx, twoColumnGrid } from "./styles";
import { toCapitalizeWords } from "../../../../utils/cases";
import type {
  Category,
  Subcategory,
  ProductType,
  ProductModel,
  Measure,
} from "../../../../types/catalog";

export interface FormValues {
  name: string;
  code: string;
  color: string;
  qualifier: string;
  description: string;
  specifications: string;
  brandId: string;
  categoryId: string;
  subCategoryId: string;
  typeId: string;
  measureValue: string | null;
  measureId: string;
  secondaryMeasureValue: string;
  secondaryMeasureId: string;
  modelName: string;
  modelId: string | null;
  image: File | null;
  priceA: string;
  priceB: string;
  priceC: string;
  priceD: string;
  isAvailable: boolean;
}

interface ProductFormFieldsProps {
  control: Control<FormValues>;
  errors: FieldErrors<FormValues>;
  setValue: UseFormSetValue<FormValues>;
  getValues: UseFormGetValues<FormValues>;
  refs: {
    // El endpoint de marcas devuelve `id` numérico, a diferencia de Brand.id
    brands: { id: string | number; name: string }[];
    categories: Category[];
    subcategories: Subcategory[];
    types: ProductType[];
  };
  measures: Measure[];
  productModels: ProductModel[];
  photo: PhotoPreview | null;
  setPhoto: (photo: PhotoPreview | null) => void;
  loading: boolean;
  loadingRefs: boolean;
}

const ProductFormFields = ({
  control,
  errors,
  setValue,
  getValues,
  refs,
  measures,
  productModels,
  photo,
  setPhoto,
  loading,
  loadingRefs,
}: ProductFormFieldsProps) => {
  return (
    <Box component="form" display="flex" flexDirection="column" noValidate>
      {/* Identificación */}
      <Typography sx={sectionTitleSx}>Identificación</Typography>
      <Box sx={twoColumnGrid}>
        {textFields.map(({ name, label }) => (
          <Controller
            key={name}
            name={name as keyof FormValues}
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label={label}
                fullWidth
                error={!!errors[name as keyof FormValues]}
                helperText={errors[name as keyof FormValues]?.message}
                disabled={loading || loadingRefs}
              />
            )}
          />
        ))}
      </Box>

      {measureFields.map(({ valueName, valueLabel, unitName, unitLabel, title }) => (
        <Box key={valueName}>
          <Typography sx={sectionTitleSx}>{title}</Typography>
          <Box sx={twoColumnGrid}>
            <Controller
              name={valueName as keyof FormValues}
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  value={field.value ?? ""}
                  label={valueLabel}
                  fullWidth
                  error={!!errors[valueName as keyof FormValues]}
                  helperText={errors[valueName as keyof FormValues]?.message}
                  disabled={loading}
                />
              )}
            />
            <Controller
              control={control}
              name={unitName as keyof FormValues}
              render={({ field }) => (
                <FormControl size="small" fullWidth>
                  <Select {...field} value={field.value || ""} displayEmpty>
                    <MenuItem disabled value="">
                      {unitLabel}
                    </MenuItem>
                    {measures.map((option) => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.abbreviation}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />
          </Box>
        </Box>
      ))}

      {/* Clasificación */}
      <Typography sx={sectionTitleSx}>Clasificación</Typography>
      <Box sx={twoColumnGrid}>
        {selectFields.map(({ name, label }) => (
          <Controller
            key={name}
            name={name as keyof FormValues}
            control={control}
            render={({ field }) => (
              <FormControl fullWidth size="small">
                <Typography fontWeight={500} fontSize="0.85rem" mb={0.5}>
                  {label}
                </Typography>
                <Select
                  {...field}
                  value={field.value ?? ""}
                  onChange={(event) => {
                    field.onChange(event);
                    // Limpiar los niveles inferiores solo cuando el usuario cambia el select,
                    // nunca durante la precarga de un producto existente.
                    if (name === "categoryId") {
                      setValue("subCategoryId", "", { shouldValidate: true, shouldDirty: true });
                      setValue("typeId", "", { shouldValidate: true, shouldDirty: true });
                    } else if (name === "subCategoryId") {
                      setValue("typeId", "", { shouldValidate: true, shouldDirty: true });
                    }
                  }}
                >
                  <MenuItem disabled value="">
                    {label}
                  </MenuItem>
                  {getSelectOptions(
                    name,
                    refs.brands,
                    refs.categories,
                    refs.subcategories,
                    refs.types
                  ).map((opt: { id: string | number; name: string }) => (
                    <MenuItem key={opt.id} value={opt.id}>
                      {toCapitalizeWords(opt.name)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
        ))}
      </Box>

      {/* Modelo */}
      <Typography sx={sectionTitleSx}>Modelo</Typography>
      <Controller
        name="modelName"
        control={control}
        render={({ field }) => {
          const currentModelName = getValues("modelName");
          const currentModelId = getValues("modelId");
          return (
            <Autocomplete
              freeSolo
              disableClearable
              options={productModels}
              getOptionLabel={(opt) => (typeof opt === "string" ? opt : (opt as ProductModel).name)}
              value={productModels.find((m) => m.name === field.value) || field.value}
              onChange={(_, newVal) => {
                const isCustom = typeof newVal === "string";
                const newName = isCustom ? newVal : (newVal as ProductModel).name;
                const newId = isCustom ? null : (newVal as ProductModel).id;
                if (newName !== currentModelName) {
                  setValue("modelName", newName, {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                }
                if (newId !== currentModelId) {
                  setValue("modelId", newId, {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                }
              }}
              onInputChange={(_, newInputValue) => {
                const current = getValues("modelName");
                if (newInputValue !== current) {
                  setValue("modelName", newInputValue, {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                  setValue("modelId", null, {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                }
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="standard"
                  fullWidth
                  error={!!errors.modelName}
                  helperText={errors.modelName?.message}
                />
              )}
            />
          );
        }}
      />

      {/* Descripción */}
      <Typography sx={sectionTitleSx}>Descripción</Typography>
      <Box sx={twoColumnGrid}>
        {multiLineFields.map(({ name, label }) => (
          <Controller
            key={name}
            name={name as keyof FormValues}
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label={label}
                fullWidth
                multiline
                minRows={3}
                error={!!errors[name as keyof FormValues]}
                helperText={errors[name as keyof FormValues]?.message}
                disabled={loading}
              />
            )}
          />
        ))}
      </Box>

      {/* Precios por tipo de cliente */}
      <Typography sx={sectionTitleSx}>Precios por tipo de cliente</Typography>
      <Box sx={twoColumnGrid}>
        {priceFields.map(({ name, label, helper }) => (
          <Controller
            key={name}
            name={name as keyof FormValues}
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label={label}
                fullWidth
                type="number"
                inputProps={{ min: 0, step: "0.01" }}
                error={!!errors[name as keyof FormValues]}
                helperText={errors[name as keyof FormValues]?.message || helper}
                disabled={loading}
              />
            )}
          />
        ))}
      </Box>

      {/* Disponibilidad */}
      <Typography sx={sectionTitleSx}>Disponibilidad</Typography>
      <Controller
        name="isAvailable"
        control={control}
        render={({ field }) => (
          <FormControlLabel
            control={
              <Switch
                checked={field.value}
                onChange={(e) => field.onChange(e.target.checked)}
                color="success"
              />
            }
            label={field.value ? "Disponible" : "No disponible (agotado)"}
          />
        )}
      />

      {/* Imagen */}
      <Typography sx={sectionTitleSx}>Imagen</Typography>
      <Dropzone
        text="Arrastra o escoge una nueva imagen"
        preview
        photo={photo}
        setPhoto={setPhoto}
        setValue={setValue}
        onRemove={() => setPhoto(null)}
      />
    </Box>
  );
};

export default ProductFormFields;
