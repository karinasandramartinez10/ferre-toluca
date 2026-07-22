"use client";

import { useBrands } from "../catalog/useBrands";
import { useCategories } from "../catalog/useCategories";
import { useSubcategories } from "../catalog/useSubcategories";
import { useProductTypesBySubcategory } from "../catalog/useProductTypesBySubcategory";

interface Params {
  categoryId?: string;
  subCategoryId?: string;
}

export function useProductFormRefs({ categoryId, subCategoryId }: Params) {
  const {
    brands,
    loading: loadingBrands,
    error: errorBrands,
    refetch: refetchBrands,
  } = useBrands();
  const {
    categories,
    loading: loadingCategories,
    error: errorCategories,
    refetch: refetchCategories,
  } = useCategories();
  const { subcategories } = useSubcategories(categoryId);
  const { productTypes } = useProductTypesBySubcategory(subCategoryId);

  const refetchRefs = () => {
    refetchBrands();
    refetchCategories();
  };

  return {
    refs: { brands, categories, subcategories, types: productTypes },
    loadingRefs: loadingBrands || loadingCategories,
    errorRefs: Boolean(errorBrands || errorCategories),
    refetchRefs,
  };
}
