import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { productSchema as Schema, productFormDefaults as defaultValues } from "./productFormSchema";
import { getBrands } from "../../../../api/admin/brands";
import { getCategories } from "../../../../api/category";
import { getProductTypes } from "../../../../api/productTypes";
import {
  getProductById,
  updateProductPricing,
  updateProductAvailability,
} from "../../../../api/products";
import { getSubcategories } from "../../../../api/subcategories";
import { useMeasures } from "../../../../hooks/catalog/useMeasures";
import { useProductModels } from "../../../../hooks/catalog/useProductModels";
import type { PhotoPreview } from "../../../../types/ui";
import { ErrorUI } from "../../../../components/Error";
import { Loading } from "../../../../components/Loading";
import { buildProductFormData } from "./buildProductFormData";
import ProductFormFields, { type FormValues } from "./ProductFormFields";
import type {
  Brand,
  Category,
  Subcategory,
  ProductType,
  ProductModel,
  Measure,
} from "../../../../types/catalog";

interface ProductActionModalProps {
  title?: string;
  open: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => Promise<void>;
  fetchData: () => Promise<void>;
  selected: {
    id: string;
    category?: { id: string };
    subCategory?: { id: string };
    updatedAt?: string;
  } | null;
  loading: boolean;
}

interface Refs {
  brands: Brand[];
  categories: Category[];
  subcategories: Subcategory[];
  types: ProductType[];
}

const ProductActionModal = ({
  title = "",
  open,
  onClose,
  onSubmit,
  fetchData,
  selected,
  loading,
}: ProductActionModalProps) => {
  const [photo, setPhoto] = useState<PhotoPreview | null>(null);

  const [refs, setRefs] = useState<Refs>({
    brands: [],
    categories: [],
    subcategories: [],
    types: [],
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

  const isInitialCategoryRunRef = useRef(true);
  const isInitialSubcategoryRunRef = useRef(true);

  useEffect(() => {
    if (!open) return;
    setLoadingRefs(true);
    setErrorRefs(false);

    const loadModalData = async () => {
      try {
        const product = await getProductById(selected!.id);

        const { brands } = await getBrands({ size: 1000 });
        const { categories } = await getCategories({ size: 1000 });
        let fetchedSubcategories: Subcategory[] = [];
        let fetchedTypes: ProductType[] = [];
        if (product?.category?.id) {
          try {
            const res = await getSubcategories({
              categoryId: product.category.id,
            });
            fetchedSubcategories = res.subcategories || [];
          } catch {
            fetchedSubcategories = [];
          }
        }
        if (product?.subCategory?.id) {
          try {
            const res = await getProductTypes({
              subcategoryId: product.subCategory.id,
            });
            fetchedTypes = res.productTypes || res.data?.productTypes || [];
          } catch {
            fetchedTypes = [];
          }
        }
        setRefs({
          brands,
          categories,
          subcategories: fetchedSubcategories,
          types: fetchedTypes,
        });

        const initial: FormValues = {
          ...defaultValues,
          ...(product && {
            name: product.name ?? "",
            code: product.code ?? "",
            color: product.color ?? "",
            description: product.description ?? "",
            specifications: product.specifications ?? "",
            brandId: product.brand?.id ?? "",
            categoryId: product.category?.id ?? "",
            subCategoryId: product.subCategory?.id ?? "",
            typeId: product.type?.id ?? "",
            qualifier: product.qualifier ?? "",
            measureValue: product.measureValue ?? null,
            measureId: product.measure?.id ?? "",
            secondaryMeasureValue: product.secondaryMeasureValue ?? "",
            secondaryMeasureId: product.secondaryMeasureId ?? "",
            modelName: product.productModel?.name ?? "",
            modelId: product.productModel?.id ?? "",
            priceA: product.priceA != null ? String(product.priceA) : "",
            priceB: product.priceB != null ? String(product.priceB) : "",
            priceC: product.priceC != null ? String(product.priceC) : "",
            priceD: product.priceD != null ? String(product.priceD) : "",
            isAvailable: product.isAvailable !== false,
          }),
        };

        reset(initial);
        isInitialCategoryRunRef.current = true;
        isInitialSubcategoryRunRef.current = true;
        const existingImage = product?.Files?.[0]?.path ?? null;
        setPhoto(existingImage ? { preview: existingImage } : null);
      } catch {
        setErrorRefs(true);
      } finally {
        setLoadingRefs(false);
      }
    };

    loadModalData();
  }, [open, selected, reset]);

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
      } catch {
        setRefs((prev) => ({ ...prev, subcategories: [] }));
      } finally {
        isInitialCategoryRunRef.current = false;
      }
    };

    fetchSubcategoriesByCategory();
  }, [categoryId, selected, setValue]);

  useEffect(() => {
    if (!subCategoryId) {
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
      } catch {
        setRefs((prev) => ({ ...prev, types: [] }));
      } finally {
        isInitialSubcategoryRunRef.current = false;
      }
    };

    fetchTypesBySubcategory();
  }, [subCategoryId, selected, setValue]);

  const handleFormSubmit = async (data: FormValues) => {
    const formData = buildProductFormData(data as unknown as Record<string, unknown>, selected);
    await onSubmit(formData);

    if (selected?.id) {
      const errors: string[] = [];

      try {
        // priceA requerido; B/C/D vacío → null limpia ese tier
        const toTier = (v: unknown) => {
          const s = v as string;
          return s !== undefined && s !== "" ? parseFloat(s) : null;
        };
        const pricingBody: Record<string, unknown> = {
          priceA: parseFloat(data.priceA as string),
          priceB: toTier(data.priceB),
          priceC: toTier(data.priceC),
          priceD: toTier(data.priceD),
        };
        await updateProductPricing(selected.id, pricingBody);
      } catch {
        errors.push("precios");
      }

      try {
        await updateProductAvailability(selected.id, data.isAvailable as boolean);
      } catch {
        errors.push("disponibilidad");
      }

      if (errors.length > 0) {
        throw new Error(`Error al actualizar ${errors.join(" y ")}`);
      }
    }

    await fetchData();
    reset(defaultValues);
  };

  const handleCloseModal = () => {
    reset(defaultValues);
    onClose();
  };

  let content;
  if (loadingRefs) {
    content = <Loading />;
  } else if (errorRefs) {
    content = (
      <ErrorUI
        onRetry={() => {
          // Trigger re-render to reload data
          setLoadingRefs(true);
          setErrorRefs(false);
        }}
        message="Error cargando datos. Intenta de nuevo."
      />
    );
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
        loadingRefs={loadingRefs}
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
