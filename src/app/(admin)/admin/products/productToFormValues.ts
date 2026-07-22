import { productFormDefaults } from "./productFormSchema";
import type { FormValues } from "./ProductFormFields";

interface AdminProduct {
  name?: string;
  code?: string;
  color?: string;
  description?: string;
  specifications?: string;
  qualifier?: string;
  measureValue?: string | null;
  secondaryMeasureValue?: string;
  secondaryMeasureId?: string;
  priceA?: number | null;
  priceB?: number | null;
  priceC?: number | null;
  priceD?: number | null;
  isAvailable?: boolean;
  brand?: { id: string };
  category?: { id: string };
  subCategory?: { id: string };
  type?: { id: string };
  measure?: { id: string };
  productModel?: { id: string; name: string };
}

export function productToFormValues(product: AdminProduct | null): FormValues {
  if (!product) return { ...productFormDefaults } as FormValues;

  return {
    ...productFormDefaults,
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
  } as FormValues;
}
