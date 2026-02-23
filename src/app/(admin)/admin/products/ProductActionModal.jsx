import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import {
  Autocomplete,
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
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { getBrands } from "../../../../api/admin/brands";
import { getCategories } from "../../../../api/category";
import { getMeasures } from "../../../../api/measures";
import { getProductModels } from "../../../../api/productModels";
import { getProductTypes } from "../../../../api/productTypes";
import { getSubcategories } from "../../../../api/subcategories";
import { Dropzone } from "../../../../components/Dropzone";
import { ErrorUI } from "../../../../components/Error";
import { Loading } from "../../../../components/Loading";
import { getSelectOptions, multiLineFields, selectFields, textFields } from "./constants";
import { sectionTitleSx, twoColumnGrid } from "./styles";
import { toCapitalizeWords } from "../../../../utils/cases";

const Schema = yup.object().shape({
  name: yup.string().required("El nombre es requerido"),
  description: yup.string().required("La descripción es requerida"),
  code: yup.string().required("El código es requerido"),
  brandId: yup.string().required("La marca es requerida"),
  categoryId: yup.string().required("La categoría es requerida"),
  specifications: yup.string(),
  color: yup.string(),
  qualifier: yup.string(),
  secondaryMeasureValue: yup.string().nullable(),
  secondaryMeasureId: yup.string(),
});

const defaultValues = {
  name: "",
  code: "",
  color: "",
  qualifier: "",
  description: "",
  specifications: "",
  brandId: "",
  categoryId: "",
  subCategoryId: "",
  typeId: "",
  measureValue: null,
  measureId: "",
  secondaryMeasureValue: "",
  secondaryMeasureId: "",
  modelName: "",
  modelId: "",
  image: null,
};

const ProductActionModal = ({
  title = "",
  open,
  onClose,
  onSubmit,
  fetchData,
  selected,
  loading,
}) => {
  const [photo, setPhoto] = useState(null);
  const [productModels, setProductModels] = useState([]);

  const [refs, setRefs] = useState({
    brands: [],
    categories: [],
    subcategories: [],
    types: [],
    measures: [],
  });
  const [loadingRefs, setLoadingRefs] = useState(false);
  const [errorRefs, setErrorRefs] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    reset,
    watch,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(Schema),
    mode: "onChange",
    defaultValues,
  });

  const brandId = watch("brandId");
  const categoryId = watch("categoryId");
  const subCategoryId = watch("subCategoryId");

  // Flags para preservar valores en la carga inicial
  const isInitialCategoryRunRef = useRef(true);
  const isInitialSubcategoryRunRef = useRef(true);

  useEffect(() => {
    if (!open) return;
    setLoadingRefs(true);
    setErrorRefs(false);

    const loadModalData = async () => {
      try {
        const { brands } = await getBrands();
        const { categories } = await getCategories();
        // Precarga filtrada según selección inicial
        let fetchedSubcategories = [];
        let fetchedTypes = [];
        if (selected?.category?.id) {
          try {
            const res = await getSubcategories({
              categoryId: selected.category.id,
            });
            fetchedSubcategories = res.subcategories || [];
          } catch (_) {
            fetchedSubcategories = [];
          }
        }
        if (selected?.subCategory?.id) {
          try {
            const res = await getProductTypes({
              subcategoryId: selected.subCategory.id,
            });
            fetchedTypes = res.productTypes || res.data?.productTypes || [];
          } catch (_) {
            fetchedTypes = [];
          }
        }
        const measures = await getMeasures();

        setRefs({
          brands,
          categories,
          subcategories: fetchedSubcategories,
          types: fetchedTypes,
          measures,
        });

        // construye objeto initial mezclando defaultValues y selected
        const initial = {
          ...defaultValues,
          ...(selected && {
            name: selected.name ?? "",
            code: selected.code ?? "",
            color: selected.color ?? "",
            description: selected.description ?? "",
            specifications: selected.specifications ?? "",
            brandId: selected.brand?.id ?? "",
            categoryId: selected.category?.id ?? "",
            subCategoryId: selected.subCategory?.id ?? "",
            typeId: selected.type?.id ?? "",
            qualifier: selected.qualifier ?? "",
            measureValue: selected.measureValue ?? null,
            measureId: selected.measure?.id ?? "",
            secondaryMeasureValue: selected.secondaryMeasureValue ?? "",
            secondaryMeasureId: selected.secondaryMeasure?.id ?? "",
            modelName: selected.productModel?.name ?? "",
            modelId: selected.productModel?.id ?? "",
          }),
        };

        reset(initial);
        // Marcar que la próxima ejecución de efectos es inicial (preservar valores)
        isInitialCategoryRunRef.current = true;
        isInitialSubcategoryRunRef.current = true;
        const existingImage = selected?.Files?.[0]?.path ?? null;
        setPhoto(existingImage ? { preview: existingImage } : null);

        // carga modelos si hay brandId
        if (initial.brandId) {
          const models = await getProductModels(initial.brandId);
          setProductModels(models);
        }
      } catch {
        setErrorRefs(true);
      } finally {
        setLoadingRefs(false);
      }
    };

    loadModalData();
  }, [open, selected, reset]);

  useEffect(() => {
    if (!brandId) {
      setProductModels([]);
      return;
    }

    const loadModels = async () => {
      try {
        const models = await getProductModels(brandId);
        setProductModels(models);
      } catch (error) {
        setProductModels([]);
      }
    };

    loadModels();

    // Limpiar si la marca cambió respecto a la seleccionada
    /*     if (selected?.brand?.id !== brandId) {
      setValue("modelName", "", { shouldValidate: true, shouldDirty: true });
      setValue("modelId", null, { shouldValidate: true, shouldDirty: true });
    }
 */
  }, [brandId]);

  // Efecto: cuando cambia la categoría, cargar subcategorías filtradas y limpiar dependencias
  useEffect(() => {
    if (!categoryId) return;

    const fetchSubcategoriesByCategory = async () => {
      try {
        const res = await getSubcategories({ categoryId });
        setRefs((prev) => ({
          ...prev,
          subcategories: res.subcategories || [],
        }));

        const preserveInitial =
          isInitialCategoryRunRef.current && selected?.category?.id === categoryId;
        if (!preserveInitial) {
          setValue("subCategoryId", "", {
            shouldValidate: true,
            shouldDirty: true,
          });
          setValue("typeId", "", { shouldValidate: true, shouldDirty: true });
          setRefs((prev) => ({ ...prev, types: [] }));
        }
      } catch (_) {
        setRefs((prev) => ({ ...prev, subcategories: [] }));
      } finally {
        // Solo preservar en la primera corrida tras abrir el modal
        isInitialCategoryRunRef.current = false;
      }
    };

    fetchSubcategoriesByCategory();
  }, [categoryId, selected, setValue]);

  // Efecto: cuando cambia la subcategoría, cargar tipos filtrados y limpiar typeId si aplica
  useEffect(() => {
    if (!subCategoryId) {
      // Si se limpió la subcategoría, limpiamos tipos
      setRefs((prev) => ({ ...prev, types: [] }));
      setValue("typeId", "", { shouldValidate: true, shouldDirty: true });
      return;
    }

    const fetchTypesBySubcategory = async () => {
      try {
        const res = await getProductTypes({ subcategoryId: subCategoryId });
        setRefs((prev) => ({
          ...prev,
          types: res.productTypes || res.data?.productTypes || [],
        }));

        const preserveInitial =
          isInitialSubcategoryRunRef.current && selected?.subCategory?.id === subCategoryId;
        if (!preserveInitial) {
          setValue("typeId", "", { shouldValidate: true, shouldDirty: true });
        }
      } catch (_) {
        setRefs((prev) => ({ ...prev, types: [] }));
      } finally {
        // Solo preservar en la primera corrida tras abrir el modal
        isInitialSubcategoryRunRef.current = false;
      }
    };

    fetchTypesBySubcategory();
  }, [subCategoryId, selected, setValue]);

  const handleFormSubmit = async (data) => {
    const formData = new FormData();

    // Si no hay modelo seleccionado ni texto válido en modelName, limpiamos
    const trimmedModelName = data.modelName?.trim();
    const shouldRemoveModel = !data.modelId && !trimmedModelName;

    if (shouldRemoveModel) {
      formData.append("modelId", "");
      formData.append("modelName", "");
    } else {
      if (data.modelId) {
        formData.append("modelId", data.modelId);
      } else if (trimmedModelName) {
        formData.append("modelName", trimmedModelName);
      }
    }

    if (data.name) formData.append("name", data.name);
    if (data.code) formData.append("code", data.code);
    if (data.color) formData.append("color", data.color);
    if (data.qualifier) formData.append("qualifier", data.qualifier);
    if (data.description) formData.append("description", data.description);
    if (data.specifications) formData.append("specifications", data.specifications);

    if (data.brandId) formData.append("brandId", data.brandId);
    if (data.categoryId) formData.append("categoryId", data.categoryId);
    if (data.subCategoryId) formData.append("subCategoryId", data.subCategoryId);
    if (data.typeId) formData.append("typeId", data.typeId);

    if (data.measureValue) formData.append("measureValue", data.measureValue);
    if (data.measureId) formData.append("measureId", data.measureId);
    if (data.secondaryMeasureValue)
      formData.append("secondaryMeasureValue", data.secondaryMeasureValue);
    if (data.secondaryMeasureId) formData.append("secondaryMeasureId", data.secondaryMeasureId);

    if (photo) {
      formData.append("image", photo);
    }

    if (selected?.updatedAt) {
      formData.append("updatedAt", selected.updatedAt);
    }

    await onSubmit(formData);
    await fetchData();
    reset(defaultValues);
  };

  const handleCloseModal = () => {
    reset(defaultValues);
    onClose();
  };

  // const currentModelName = getValues("modelName");
  // const currentModelId = getValues("modelId");

  let content;
  if (loadingRefs) {
    content = <Loading />;
  } else if (errorRefs) {
    content = (
      <ErrorUI
        onRetry={() => {
          loadModalData();
        }}
        message="Error cargando datos. Intenta de nuevo."
      />
    );
  } else {
    // aquí va todo tu formulario
    content = (
      <Box component="form" display="flex" flexDirection="column" noValidate>
        {/* Identificación */}
        <Typography sx={sectionTitleSx}>Identificación</Typography>
        <Box sx={twoColumnGrid}>
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
                  disabled={loading || loadingRefs}
                />
              )}
            />
          ))}
        </Box>

        {/* Medidas */}
        <Typography sx={sectionTitleSx}>Medidas</Typography>
        <Box sx={twoColumnGrid}>
          <Controller
            name="measureValue"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Valor"
                fullWidth
                error={!!errors.measureValue}
                helperText={errors.measureValue?.message}
                disabled={loading}
              />
            )}
          />
          <Controller
            control={control}
            name="measureId"
            render={({ field }) => (
              <FormControl size="small" fullWidth>
                <Select {...field} value={field.value || ""} displayEmpty>
                  <MenuItem disabled value="">
                    Unidad
                  </MenuItem>
                  {refs.measures.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.abbreviation}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
        </Box>

        {/* Medida secundaria */}
        <Typography sx={sectionTitleSx}>Medida secundaria</Typography>
        <Box sx={twoColumnGrid}>
          <Controller
            name="secondaryMeasureValue"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                value={field.value || ""}
                label="Valor secundario"
                fullWidth
                error={!!errors.secondaryMeasureValue}
                helperText={errors.secondaryMeasureValue?.message}
                disabled={loading}
              />
            )}
          />
          <Controller
            control={control}
            name="secondaryMeasureId"
            render={({ field }) => (
              <FormControl size="small" fullWidth>
                <Select {...field} value={field.value || ""} displayEmpty>
                  <MenuItem disabled value="">
                    Unidad secundaria
                  </MenuItem>
                  {refs.measures.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.abbreviation}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
        </Box>

        {/* Clasificación */}
        <Typography sx={sectionTitleSx}>Clasificación</Typography>
        <Box sx={twoColumnGrid}>
          {selectFields.map(({ name, label }) => (
            <Controller
              key={name}
              name={name}
              control={control}
              render={({ field }) => (
                <FormControl fullWidth size="small">
                  <Typography fontWeight={500} fontSize="0.85rem" mb={0.5}>
                    {label}
                  </Typography>
                  <Select {...field} value={field.value ?? ""}>
                    <MenuItem disabled value="">
                      {label}
                    </MenuItem>
                    {getSelectOptions(
                      name,
                      refs.brands,
                      refs.categories,
                      refs.subcategories,
                      refs.types
                    ).map((opt) => (
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
                getOptionLabel={(opt) => (typeof opt === "string" ? opt : opt.name)}
                value={productModels.find((m) => m.name === field.value) || field.value}
                onChange={(_, newVal) => {
                  const isCustom = typeof newVal === "string";
                  const newName = isCustom ? newVal : newVal.name;
                  const newId = isCustom ? null : newVal.id;
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
        </Box>

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
  }

  return (
    <Dialog open={open} onClose={handleCloseModal} fullWidth maxWidth="md">
      <DialogTitle sx={{ fontWeight: 600 }}>{`Editar ${title}`}</DialogTitle>
      <DialogContent>{content}</DialogContent>
      <DialogActions>
        <Button onClick={handleCloseModal} variant="outlined" disabled={loading}>
          Cancelar
        </Button>
        <LoadingButton
          onClick={handleSubmit(handleFormSubmit)}
          loading={loading}
          disabled={loading || !isValid || loadingRefs}
          variant="contained"
          color="primary"
        >
          Guardar Cambios
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default ProductActionModal;
