"use server";

import type { Category } from "../types/catalog";

interface CategoryWithPath extends Category {
  path: string;
}

function createCategoryPath(name: unknown): string {
  const safeName = typeof name === "string" ? name : "";
  return safeName.toLowerCase().replace(/\s+/g, "-");
}

export async function getCategoriesServer(): Promise<CategoryWithPath[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/v1/category?size=1000`,
      { cache: "force-cache" }
    );

    if (!res.ok) {
      console.warn("[getCategoriesServer] Non-OK response. Falling back to []", res.status);
      return [];
    }

    const response = await res.json().catch(() => ({ data: { categories: [] } }));

    const rawCategories = response?.data?.categories;
    if (!Array.isArray(rawCategories)) {
      console.warn("[getCategoriesServer] Invalid payload shape. Using []");
      return [];
    }

    const categories: CategoryWithPath[] = rawCategories.map((cat: Category) => ({
      ...cat,
      path: createCategoryPath(cat?.name),
    }));
    return categories;
  } catch (error) {
    console.warn("[getCategoriesServer] Fetch failed. Using []", (error as Error)?.message);
    return [];
  }
}
