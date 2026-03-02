"use server";

import type { Brand } from "../types/catalog";

export async function getBrandsServer(): Promise<Brand[] | { error: string }> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/v1/brands?size=1000`, {
      cache: "force-cache",
    });

    if (!res.ok) {
      return {
        error: "Failed to fetch data",
      };
    }

    const response = await res.json();
    const brands: Brand[] = response.data.brands ?? [];
    return brands;
  } catch (error) {
    console.error("error", error);
    return [];
  }
}
