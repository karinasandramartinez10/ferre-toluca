import { toSlug } from "../../../../utils/cases";

export const getBreadcrumbsItems = (product) =>
  [
    { label: "Inicio", path: "/" },
    product?.category && {
      label: product?.category.name,
      path: `/categories/${toSlug(product.category.name)}?id=${
        product?.category.id
      }`,
    },
    /*     product?.subCategory && {
          label: product?.subCategory.name,
          path: `/subcategories/${toSlug(product.subCategory.name)}?id=${
            product?.subCategory.id
          }`,
        }, */
    product?.brand && {
      label: product?.brand.name,
      path: `/brands/${toSlug(product.brand.name)}?id=${product.brand.id}`,
    },
    /*     product?.type && {
          label: product?.type.name,
          path: `/types/${toSlug(product.type.name)}?id=${product.type.id}`,
        }, */
    { label: product?.name }, // Último ítem sin `path`
  ].filter(Boolean);

export default getBreadcrumbsItems;
