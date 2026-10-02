"use server";

import { revalidatePath } from "next/cache";

const MAX_PRODUCT_PATHS = 100;

export async function revalidateProduct(
  productId: string,
  variantIds: Array<string | number> = []
): Promise<void> {
  const ids = new Set([productId, ...variantIds].map(String).filter((id) => /^\d+$/.test(id)));
  Array.from(ids)
    .slice(0, MAX_PRODUCT_PATHS)
    .forEach((id) => revalidatePath(`/product/${id}`));
  revalidatePath("/");
}

export async function revalidateBrandPage(codeName: string): Promise<void> {
  revalidatePath(`/brands/${codeName}`);
  revalidatePath("/");
}

export async function revalidateCategoryPage(path: string): Promise<void> {
  revalidatePath(`/categories/${path}`);
}

export async function revalidateSubcategoryPage(slug: string): Promise<void> {
  revalidatePath(`/subcategories/${slug}`);
}

export async function revalidateTypePage(slug: string): Promise<void> {
  revalidatePath(`/types/${slug}`);
}
