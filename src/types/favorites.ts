import type { Product } from "./product";

export interface FavoriteEntry {
  productId: string;
  product: Product;
}
