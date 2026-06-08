import type { PriceTier } from "./pricing";

export interface Product {
  id: string;
  price: number;
  priceList: number;
  appliedTier: PriceTier;
  discountPercentage?: number | null;
  isAvailable: boolean;
  priceA?: number;
  priceB?: number | null;
  priceC?: number | null;
  priceD?: number | null;
  [key: string]: unknown;
}

export interface ProductVariant {
  id: string;
  [key: string]: unknown;
}

export interface ProductGroup {
  variantGroupKey: string;
  variants: ProductVariant[];
}

export interface GroupedResult {
  products: ProductGroup[];
  count: number;
  totalPages: number;
}
