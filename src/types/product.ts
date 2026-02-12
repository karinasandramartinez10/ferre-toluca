export interface Product {
  id: string;
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
