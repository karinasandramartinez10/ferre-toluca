export type PromotionType = "percentage" | "buy_x_get_y";

export type PromotionScopeType = "brand" | "category" | "subcategory" | "type" | "product";

export interface ProductPromotion {
  id: number;
  type: PromotionType;
  discountPercentage: number;
  scopeType: PromotionScopeType;
  name: string;
}

export interface ProductBadge {
  type: "buy_x_get_y";
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
  brandId: number | null;
  categoryId: number | null;
  subCategoryId: number | null;
  typeId: number | null;
  productId: number | null;
  discountPercentage: number | null;
  buyQuantity: number | null;
  getQuantity: number | null;
  getDiscountPercentage: number | null;
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
  discountPercentage?: number;
  buyQuantity?: number;
  getQuantity?: number;
  getDiscountPercentage?: number;
  label?: string;
  description?: string | null;
  scopeType: PromotionScopeType;
  scopeId: number;
  scopeName: string;
  startsAt: string;
  endsAt: string;
}
