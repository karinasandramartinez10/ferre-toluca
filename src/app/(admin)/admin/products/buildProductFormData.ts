interface Selected {
  updatedAt?: string;
}

export function buildProductFormData(
  data: Record<string, unknown>,
  selected: Selected | null
): FormData {
  const formData = new FormData();

  const trimmedModelName = (data.modelName as string)?.trim();
  const shouldRemoveModel = !data.modelId && !trimmedModelName;

  if (shouldRemoveModel) {
    formData.append("modelId", "");
    formData.append("modelName", "");
  } else {
    if (data.modelId) {
      formData.append("modelId", data.modelId as string);
    } else if (trimmedModelName) {
      formData.append("modelName", trimmedModelName);
    }
  }

  if (data.name) formData.append("name", data.name as string);
  if (data.code) formData.append("code", data.code as string);
  if (data.color) formData.append("color", data.color as string);
  if (data.qualifier) formData.append("qualifier", data.qualifier as string);
  if (data.description) formData.append("description", data.description as string);
  if (data.specifications) formData.append("specifications", data.specifications as string);

  if (data.brandId) formData.append("brandId", data.brandId as string);
  if (data.categoryId) formData.append("categoryId", data.categoryId as string);
  if (data.subCategoryId) formData.append("subCategoryId", data.subCategoryId as string);
  if (data.typeId) formData.append("typeId", data.typeId as string);

  if (data.measureValue) formData.append("measureValue", data.measureValue as string);
  if (data.measureId) formData.append("measureId", data.measureId as string);
  if (data.secondaryMeasureValue)
    formData.append("secondaryMeasureValue", data.secondaryMeasureValue as string);
  if (data.secondaryMeasureId)
    formData.append("secondaryMeasureId", data.secondaryMeasureId as string);

  if (data.image instanceof File) {
    formData.append("image", data.image);
  }

  if (selected?.updatedAt) {
    formData.append("updatedAt", selected.updatedAt);
  }

  return formData;
}
