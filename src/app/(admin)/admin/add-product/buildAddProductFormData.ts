interface ProductFormValues {
  brandId: string;
  categoryId: string;
  hasType: string;
  subCategoryId: string;
  typeId: string;
  image?: File;
}

interface ProductRow {
  name: string;
  description: string;
  code: string;
  specifications: string;
  color?: string;
  qualifier: string;
  secondaryMeasureValue: string;
  secondaryMeasureId: string | null;
  modelId: string | null;
  modelName: string;
  measureId: string | null;
  measureValue: string;
}

export function buildAddProductFormData(values: ProductFormValues, rows: ProductRow[]): FormData {
  const formData = new FormData();

  if (values.image) {
    formData.append("image", values.image);
  }
  formData.append("brandId", values.brandId);
  formData.append("categoryId", values.categoryId);
  formData.append("subCategoryId", values.subCategoryId);
  if (values.hasType === "yes" && values.typeId) {
    formData.append("typeId", values.typeId);
  }

  rows.forEach((product, index) => {
    formData.append(`products[${index}][name]`, product.name ? product.name.trim() : "");
    formData.append(
      `products[${index}][description]`,
      product.description ? product.description.trim() : ""
    );
    formData.append(`products[${index}][code]`, product.code ? product.code.toUpperCase() : "");
    formData.append(
      `products[${index}][specifications]`,
      product.specifications ? product.specifications.trim() : ""
    );
    formData.append(`products[${index}][color]`, product.color ? product.color.trim() : "");
    formData.append(
      `products[${index}][qualifier]`,
      product.qualifier ? product.qualifier.trim() : ""
    );
    formData.append(
      `products[${index}][secondaryMeasureValue]`,
      product.secondaryMeasureValue || ""
    );
    if (product.secondaryMeasureId) {
      formData.append(`products[${index}][secondaryMeasureId]`, product.secondaryMeasureId);
    }

    if (product.modelId) {
      formData.append(`products[${index}][modelId]`, product.modelId);
    } else if (product.modelName) {
      formData.append(`products[${index}][modelName]`, product.modelName.trim());
    }

    formData.append(`products[${index}][measureId]`, product.measureId || "");
    formData.append(`products[${index}][measureValue]`, product.measureValue || "");
  });

  return formData;
}
