import { useEffect, useState } from "react";
import { getBrands } from "../../api/admin/brands";
import { getCategories } from "../../api/category";
import { getSubcategories } from "../../api/subcategories";
import { getProductTypes } from "../../api/productTypes";
import type { Brand, Category, Subcategory, ProductType } from "../../types/catalog";

interface ProductFormRefs {
  brands: Brand[];
  categories: Category[];
  subcategories: Subcategory[];
  types: ProductType[];
}

interface Params {
  categoryId: string;
  subCategoryId: string;
  setValue: (name: string, value: unknown, options?: { shouldValidate?: boolean }) => void;
}

/**
 * Carga marcas/categorías y maneja la cascada categoría→subcategoría→tipo
 * para el form de alta individual de producto. Al cambiar la categoría/subcat
 * limpia los niveles inferiores. (El modal de edición tiene su propia carga
 * inicial con preload del producto.)
 */
export function useProductFormRefs({ categoryId, subCategoryId, setValue }: Params) {
  const [refs, setRefs] = useState<ProductFormRefs>({
    brands: [],
    categories: [],
    subcategories: [],
    types: [],
  });
  const [loadingRefs, setLoadingRefs] = useState(true);
  const [errorRefs, setErrorRefs] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoadingRefs(true);
      setErrorRefs(false);
      try {
        const [brandsRes, categoriesRes] = await Promise.all([
          getBrands({ size: 1000 }),
          getCategories({ size: 1000 }),
        ]);
        if (active) {
          setRefs((prev) => ({
            ...prev,
            brands: brandsRes.brands || [],
            categories: categoriesRes.categories || [],
          }));
        }
      } catch {
        if (active) setErrorRefs(true);
      } finally {
        if (active) setLoadingRefs(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!categoryId) {
      setRefs((prev) => ({ ...prev, subcategories: [], types: [] }));
      return;
    }
    let active = true;
    setValue("subCategoryId", "", { shouldValidate: true });
    setValue("typeId", "", { shouldValidate: true });
    (async () => {
      try {
        const res = await getSubcategories({ categoryId });
        if (active)
          setRefs((prev) => ({ ...prev, subcategories: res.subcategories || [], types: [] }));
      } catch {
        if (active) setRefs((prev) => ({ ...prev, subcategories: [] }));
      }
    })();
    return () => {
      active = false;
    };
  }, [categoryId, setValue]);

  useEffect(() => {
    if (!subCategoryId) {
      setRefs((prev) => ({ ...prev, types: [] }));
      return;
    }
    let active = true;
    setValue("typeId", "", { shouldValidate: true });
    (async () => {
      try {
        const res = await getProductTypes({ subcategoryId: subCategoryId });
        if (active) {
          setRefs((prev) => ({
            ...prev,
            types: res.productTypes || res.data?.productTypes || [],
          }));
        }
      } catch {
        if (active) setRefs((prev) => ({ ...prev, types: [] }));
      }
    })();
    return () => {
      active = false;
    };
  }, [subCategoryId, setValue]);

  return { refs, loadingRefs, errorRefs };
}
