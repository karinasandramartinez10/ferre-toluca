import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { useEffect, useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { productSchema as Schema, productFormDefaults as defaultValues } from "./productFormSchema";
import { getProductById } from "../../../../api/products";
import { useMeasures } from "../../../../hooks/catalog/useMeasures";
import { useProductModels } from "../../../../hooks/catalog/useProductModels";
import { useProductFormRefs } from "../../../../hooks/admin/useProductFormRefs";
import type { ProductUpdatePayload } from "../../../../hooks/admin/useUpdateProduct";
import type { PhotoPreview } from "../../../../types/ui";
import { ErrorUI } from "../../../../components/Error";
import { Loading } from "../../../../components/Loading";
import { buildProductFormData } from "./buildProductFormData";
import { productToFormValues } from "./productToFormValues";
import ProductFormFields, { type FormValues } from "./ProductFormFields";
import type { ProductModel, Measure } from "../../../../types/catalog";

interface ProductActionModalProps {
  title?: string;
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: ProductUpdatePayload) => Promise<void>;
  selected: {
    id: string;
    updatedAt?: string;
  } | null;
  loading: boolean;
}

// priceA requerido; B/C/D vacío → null limpia ese tier
const toTier = (v: unknown) => {
  const s = v as string;
  return s !== undefined && s !== "" ? parseFloat(s) : null;
};

const ProductActionModal = ({
  title = "",
  open,
  onClose,
  onSubmit,
  selected,
  loading,
}: ProductActionModalProps) => {
  const [photo, setPhoto] = useState<PhotoPreview | null>(null);
  const [loadingProduct, setLoadingProduct] = useState(false);
  const [errorProduct, setErrorProduct] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    reset,
    watch,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    resolver: yupResolver(Schema) as Resolver<FormValues>,
    mode: "onChange",
    defaultValues,
  });

  const brandId = watch("brandId");
  const categoryId = watch("categoryId");
  const subCategoryId = watch("subCategoryId");

  const { measures } = useMeasures();
  const { productModels } = useProductModels(brandId);
  const { refs, loadingRefs, errorRefs, refetchRefs } = useProductFormRefs({
    categoryId,
    subCategoryId,
  });

  useEffect(() => {
    if (!open || !selected) return;
    let active = true;
    setLoadingProduct(true);
    setErrorProduct(false);

    getProductById(selected.id)
      .then((product) => {
        if (!active) return;
        reset(productToFormValues(product));
        const existingImage = product?.Files?.[0]?.path ?? null;
        setPhoto(existingImage ? { preview: existingImage } : null);
      })
      .catch(() => {
        if (active) setErrorProduct(true);
      })
      .finally(() => {
        if (active) setLoadingProduct(false);
      });

    return () => {
      active = false;
    };
  }, [open, selected, reset, retryCount]);

  const handleFormSubmit = async (data: FormValues) => {
    await onSubmit({
      formData: buildProductFormData(data as unknown as Record<string, unknown>, selected),
      pricing: {
        priceA: parseFloat(data.priceA as string),
        priceB: toTier(data.priceB),
        priceC: toTier(data.priceC),
        priceD: toTier(data.priceD),
      },
      isAvailable: data.isAvailable as boolean,
    });
  };

  const handleCloseModal = () => {
    reset(defaultValues);
    onClose();
  };

  const handleRetry = () => {
    refetchRefs();
    setRetryCount((count) => count + 1);
  };

  const isLoadingData = loadingProduct || loadingRefs;

  let content;
  if (isLoadingData) {
    content = <Loading />;
  } else if (errorProduct || errorRefs) {
    content = <ErrorUI onRetry={handleRetry} message="Error cargando datos. Intenta de nuevo." />;
  } else {
    content = (
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
        loadingRefs={isLoadingData}
      />
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
          disabled={loading || !isValid || isLoadingData}
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
