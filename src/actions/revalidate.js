"use server";

import { revalidatePath } from "next/cache";

export async function revalidateProduct(productId) {
  revalidatePath(`/product/${productId}`);
}

export async function revalidateBrandPage(codeName) {
  revalidatePath(`/brands/${codeName}`);
  revalidatePath("/");
}

export async function revalidateCategoryPage(path) {
  revalidatePath(`/categories/${path}`);
}

export async function revalidateSubcategoryPage(slug) {
  revalidatePath(`/subcategories/${slug}`);
}

export async function revalidateTypePage(slug) {
  revalidatePath(`/types/${slug}`);
}

export async function revalidateHome() {
  revalidatePath("/");
}
