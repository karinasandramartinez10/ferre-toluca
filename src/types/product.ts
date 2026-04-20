export interface Product {
  id: string;
  retailPrice: string;
  wholesalePrice: string | null;
  isAvailable: boolean;
  discountPercentage?: number | null;
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
