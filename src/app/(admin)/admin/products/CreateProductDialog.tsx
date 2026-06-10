"use client";

import { useState } from "react";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useForm } from "react-hook-form";
import type { Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSnackbar } from "notistack";
import { postProduct } from "../../../../api/admin";
import { getApiErrorMessage } from "../../../../utils/apiError";
import { useMeasures } from "../../../../hooks/catalog/useMeasures";
import { useProductModels } from "../../../../hooks/catalog/useProductModels";
import { useProductFormRefs } from "../../../../hooks/admin/useProductFormRefs";
import { Loading } from "../../../../components/Loading";
import { ErrorUI } from "../../../../components/Error";
import type { PhotoPreview } from "../../../../types/ui";
import type { Measure, ProductModel } from "../../../../types/catalog";
import ProductFormFields, { type FormValues } from "./ProductFormFields";
import { productSchema, productFormDefaults } from "./productFormSchema";
import { buildAddProductFormData } from "./add-product/buildAddProductFormData";

interface CreateProductDialogProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

const CreateProductDialog = ({ open, onClose, onCreated }: CreateProductDialogProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [photo, setPhoto] = useState<PhotoPreview | null>(null);

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    reset,
    watch,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    resolver: yupResolver(productSchema) as Resolver<FormValues>,
    mode: "onChange",
    defaultValues: productFormDefaults,
  });

  const brandId = watch("brandId");
  const categoryId = watch("categoryId");
  const subCategoryId = watch("subCategoryId");

  const { measures } = useMeasures();
  const { productModels } = useProductModels(brandId);
  const { refs, loadingRefs, errorRefs } = useProductFormRefs({
    categoryId,
    subCategoryId,
    setValue,
  });

  const handleClose = () => {
    reset(productFormDefaults);
    setPhoto(null);
    onClose();
  };

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    try {
      const formData = buildAddProductFormData(
        {
          brandId: values.brandId,
          categoryId: values.categoryId,
          subCategoryId: values.subCategoryId,
          hasType: values.typeId ? "yes" : "no",
          typeId: values.typeId,
          image: values.image || undefined,
        },
        [
          {
            name: values.name,
            description: values.description,
            code: values.code,
            specifications: values.specifications,
            color: values.color,
            qualifier: values.qualifier,
            secondaryMeasureValue: values.secondaryMeasureValue,
            secondaryMeasureId: values.secondaryMeasureId || null,
            modelId: values.modelId,
            modelName: values.modelName,
            measureId: values.measureId || null,
            measureValue: values.measureValue || "",
            priceA: values.priceA,
            priceB: values.priceB,
            priceC: values.priceC,
            priceD: values.priceD,
            isAvailable: values.isAvailable,
          },
        ]
      );

      await postProduct(formData);
      enqueueSnackbar("Producto agregado exitosamente", {
        variant: "success",
        autoHideDuration: 5000,
        anchorOrigin: { vertical: "top", horizontal: "right" },
      });
      reset(productFormDefaults);
      setPhoto(null);
      onCreated();
    } catch (error) {
      enqueueSnackbar(getApiErrorMessage(error), {
        variant: "error",
        autoHideDuration: 6000,
        anchorOrigin: { vertical: "top", horizontal: "right" },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ fontWeight: 600 }}>Agregar producto</DialogTitle>
      <DialogContent>
        {loadingRefs ? (
          <Box sx={{ py: 4 }}>
            <Loading />
          </Box>
        ) : errorRefs ? (
          <ErrorUI
            onRetry={() => window.location.reload()}
            message="No pudimos cargar marcas y categorías. Intenta de nuevo."
          />
        ) : (
          <ProductFormFields
            control={control}
            errors={errors}
            setValue={setValue}
            getValues={getValues}
            refs={refs}
            measures={measures as Measure[]}
            productModels={productModels as ProductModel[]}
            photo={photo}
            setPhoto={setPhoto}
            loading={loading}
            loadingRefs={loadingRefs}
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="outlined" disabled={loading}>
          Cancelar
        </Button>
        <LoadingButton
          onClick={handleSubmit(onSubmit)}
          loading={loading}
          disabled={loading || loadingRefs || !isValid}
          variant="contained"
        >
          Agregar producto
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default CreateProductDialog;
