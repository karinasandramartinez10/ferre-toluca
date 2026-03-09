"use server";

import { revalidatePath } from "next/cache";

export async function revalidateProduct(productId: string): Promise<void> {
  revalidatePath(`/product/${productId}`);
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

export async function revalidateHome(): Promise<void> {
  revalidatePath("/");
}
