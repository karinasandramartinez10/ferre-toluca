export type PromotionType = "percentage" | "volume_price";

export type PriceMode = "percentage" | "absolute";

export type PriceTier = "A" | "B" | "C" | "D";

export type PromotionScopeType = "brand" | "category" | "subcategory" | "type" | "product";

export interface ProductPromotion {
  id: number;
  type: "percentage";
  discountPercentage: number;
  scopeType: PromotionScopeType;
  name: string;
}

export interface ProductBadge {
  type: "volume_price";
  promotionId: number;
  label: string;
  description?: string;
  name: string;
}

export type PromotionStatus = "active" | "scheduled" | "expired" | "inactive";

export interface Promotion {
  id: number;
  name: string;
  type: PromotionType;
  applicableTiers: PriceTier[] | null;
  brandId: number | null;
  categoryId: number | null;
  subCategoryId: number | null;
  typeId: number | null;
  productId: number | null;
  discountPercentage: number | null;
  minQuantity: number | null;
  priceMode: PriceMode | null;
  volumeDiscountPercentage: number | null;
  volumePriceA: number | null;
  volumePriceB: number | null;
  volumePriceC: number | null;
  volumePriceD: number | null;
  label: string | null;
  description: string | null;
  startsAt: string;
  endsAt: string;
  active: boolean;
  status: PromotionStatus;
  createdAt: string;
  updatedAt: string;
}

export interface PromotionsResult {
  promotions: Promotion[];
  count: number;
  page: number;
  totalPages: number;
}

export interface ActivePromotion {
  id: number;
  name: string;
  type: PromotionType;
  applicableTiers: PriceTier[] | null;
  discountPercentage?: number;
  minQuantity?: number;
  priceMode?: PriceMode;
  volumeDiscountPercentage?: number;
  volumePrice?: number;
  label?: string;
  description?: string | null;
  scopeType: PromotionScopeType;
  scopeId: number;
  scopeName: string;
  startsAt: string;
  endsAt: string;
}

// Árbol de navegación que devuelve getMenuTree (categoría › subcategoría › tipo).
export interface MenuTreeType {
  id: number;
  name: string;
  productCount: number;
}

export interface MenuTreeSubcategory {
  id: number;
  name: string;
  productCount: number;
  types?: MenuTreeType[];
}

export interface MenuTreeCategory {
  id: number;
  name: string;
  productCount: number;
  subcategories?: MenuTreeSubcategory[];
}

// Admin: selección de ámbitos y tiles del board.
export interface ScopeSelection {
  kind: PromotionScopeType;
  id: number;
  label: string;
  code?: string | null;
  image?: string | null;
}

export interface ScopeOption {
  id: number;
  label: string;
  code?: string | null;
  image?: string | null;
}

export interface ScopeTileData {
  id: number;
  name: string;
  label: string;
  count?: number;
  childCount?: number;
  childLabel?: string;
  image?: { publicId?: string; alt?: string };
}

export type CatalogScopeKind = "category" | "subcategory" | "type";

export interface CatalogCrumb {
  id: number;
  name: string;
}

export interface CatalogView {
  kind: CatalogScopeKind;
  tiles: ScopeTileData[];
}

// Precios vigentes por tier de un producto del ámbito (GET /promotion/scope-preview).
export interface ScopePreviewProduct {
  id: number;
  name: string;
  code: string;
  prices: Record<PriceTier, number>;
}

// Valores del formulario de promoción (composer y modal).
export interface PromotionFormValues {
  name: string;
  type: PromotionType;
  applicableTiers: PriceTier[];
  scopeKind?: PromotionScopeType;
  scopeOption?: ScopeOption | null;
  month: number;
  year: number;
  active: boolean;
  discountPercentage?: number | null;
  minQuantity?: number | null;
  priceMode?: PriceMode;
  volumeDiscountPercentage?: number | null;
  volumePriceA?: number | null;
  volumePriceB?: number | null;
  volumePriceC?: number | null;
  volumePriceD?: number | null;
}
