import {
  toCapitalizeFirstLetter,
  toCapitalizeWords,
  toSlug,
} from "../utils/cases";

export const homeItem = { label: "Inicio", path: "/" };

export const buildCategoryItem = (name, id) =>
  name && id
    ? {
        label: toCapitalizeWords(name),
        path: `/categories/${toSlug(name)}?id=${id}`,
      }
    : null;

export const buildSubcategoryItem = (name, id) =>
  name && id
    ? {
        label: toCapitalizeWords(name),
        path: `/subcategories/${toSlug(name)}?id=${id}`,
      }
    : null;

export const buildBrandItem = (name, id) =>
  name && id
    ? {
        label: toCapitalizeWords(name),
        path: `/brands/${toSlug(name)}?id=${id}`,
      }
    : null;

export const buildTypeItem = (name, id) =>
  name && id
    ? {
        label: toCapitalizeWords(name),
        path: `/types/${toSlug(name)}?id=${id}`,
      }
    : null;

// Page-level builders
export const buildBrandBreadcrumbs = (brandName, brandId) =>
  [homeItem, buildBrandItem(brandName, brandId)].filter(Boolean);

export const buildCategoryBreadcrumbs = (categoryName, categoryId) =>
  [homeItem, buildCategoryItem(categoryName, categoryId)].filter(Boolean);

// For Subcategory page: Home / [Category] / [Subcategory]
export const buildSubcategoryBreadcrumbs = (
  subcategoryName,
  representativeProduct
) => {
  const category = representativeProduct?.category;
  return [
    homeItem,
    buildCategoryItem(category?.name, category?.id),
    { label: toCapitalizeFirstLetter(subcategoryName) },
  ].filter(Boolean);
};

// For Type page: Home / [Subcategory] / [Type]
export const buildTypeBreadcrumbs = (typeName, representativeProduct) => {
  const subcategory = representativeProduct?.subCategory;
  return [
    homeItem,
    buildSubcategoryItem(subcategory?.name, subcategory?.id),
    { label: toCapitalizeFirstLetter(typeName) },
  ].filter(Boolean);
};
