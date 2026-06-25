export const PROMOTION_TYPE_LABELS = {
  percentage: "Porcentaje",
  buy_x_get_y: "NxM",
};

export const PROMOTION_TYPE_OPTIONS = [
  { value: "percentage", label: "Porcentaje (%)" },
  { value: "buy_x_get_y", label: "NxM (compra X, lleva Y)" },
];

export const PROMOTION_STATUS_LABELS = {
  active: "Activa",
  scheduled: "Programada",
  expired: "Expirada",
  inactive: "Inactiva",
};

export const PROMOTION_STATUS_COLORS = {
  active: "success",
  scheduled: "info",
  expired: "default",
  inactive: "warning",
};

export const SCOPE_KINDS = [
  { value: "brand", label: "Marca" },
  { value: "category", label: "Categoría" },
  { value: "subcategory", label: "Subcategoría" },
  { value: "type", label: "Tipo" },
  { value: "product", label: "Producto" },
];

export const SCOPE_KIND_LABELS = {
  brand: "Marca",
  category: "Categoría",
  subcategory: "Subcategoría",
  type: "Tipo",
  product: "Producto",
};

// kind del FE → campo del body que espera el BE (exactamente uno por promo).
export const SCOPE_BODY_FIELD = {
  brand: "brandId",
  category: "categoryId",
  subcategory: "subCategoryId",
  type: "typeId",
  product: "productId",
};

export const MONTHS = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

export const promotionShortLabel = (promotion) =>
  promotion.type === "percentage"
    ? `-${promotion.discountPercentage}%`
    : `${promotion.buyQuantity + promotion.getQuantity}x${promotion.buyQuantity}`;

export const getPromotionScope = (promotion) => {
  if (promotion.brandId != null) return { kind: "brand", id: promotion.brandId };
  if (promotion.categoryId != null) return { kind: "category", id: promotion.categoryId };
  if (promotion.subCategoryId != null) return { kind: "subcategory", id: promotion.subCategoryId };
  if (promotion.typeId != null) return { kind: "type", id: promotion.typeId };
  if (promotion.productId != null) return { kind: "product", id: promotion.productId };
  return { kind: "brand", id: null };
};
