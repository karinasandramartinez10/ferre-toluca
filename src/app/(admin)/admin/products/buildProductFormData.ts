interface Selected {
  updatedAt?: string;
}

// Requeridos por el schema: si llegan vacíos es un bug de validación, no una limpieza.
const REQUIRED_FIELDS = ["name", "code", "description", "brandId", "categoryId"];

// Opcionales: se envían siempre, incluso vacíos. Mandar "" significa "limpiar este
// valor"; omitir el campo hace que el BE conserve el anterior. Incluye las cuatro FK
// opcionales, que el BE acepta vacías desde el fix de PATCH /product/:id.
const CLEARABLE_FIELDS = [
  "color",
  "qualifier",
  "specifications",
  "measureValue",
  "secondaryMeasureValue",
  "subCategoryId",
  "typeId",
  "measureId",
  "secondaryMeasureId",
];

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

  REQUIRED_FIELDS.forEach((key) => {
    const value = data[key];
    if (value) formData.append(key, String(value));
  });

  CLEARABLE_FIELDS.forEach((key) => {
    const value = data[key];
    formData.append(key, value == null ? "" : String(value));
  });

  if (data.image instanceof File) {
    formData.append("image", data.image);
  }

  if (selected?.updatedAt) {
    formData.append("updatedAt", selected.updatedAt);
  }

  return formData;
}
