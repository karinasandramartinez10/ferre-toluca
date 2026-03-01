"use server";

export async function fetchGroupedProductsServer(page = 1, size = 10) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/v1/product/grouped?page=${page}&size=${size}`
    );

    if (!res.ok) {
      throw new Error(`Error ${res.status}: ${await res.text()}`);
    }

    const response = await res.json();

    const products = response?.products ?? [];

    return products;
  } catch (error) {
    console.error("Error fetching grouped products:", error);
    return [];
  }
}

export async function getProductIdsServer() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/v1/product/ids`, {
      cache: "force-cache",
    });

    if (!res.ok) {
      console.warn("[getProductIdsServer] Non-OK response. Falling back to []", res.status);
      return [];
    }

    const response = await res.json().catch(() => ({ data: [] }));

    const ids = response?.data;
    if (!Array.isArray(ids)) {
      console.warn("[getProductIdsServer] Invalid payload shape. Using []");
      return [];
    }

    return ids;
  } catch (error) {
    console.warn("[getProductIdsServer] Fetch failed. Using []", error?.message);
    return [];
  }
}

export async function getPopularProductIdsServer(limit = 500) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/v1/product/popular?limit=${limit}`,
      { cache: "force-cache" }
    );

    if (!res.ok) {
      console.warn("[getPopularProductIdsServer] Non-OK response. Falling back to []", res.status);
      return [];
    }

    const response = await res.json().catch(() => ({ data: [] }));

    const ids = response?.data;
    if (!Array.isArray(ids)) {
      console.warn("[getPopularProductIdsServer] Invalid payload shape. Using []");
      return [];
    }

    return ids;
  } catch (error) {
    console.warn("[getPopularProductIdsServer] Fetch failed. Using []", error?.message);
    return [];
  }
}

export const getProductById = async (id) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/v1/product/${id}`);

    const response = await res.json();
    return response.data;
  } catch (error) {
    return {};
  }
};
