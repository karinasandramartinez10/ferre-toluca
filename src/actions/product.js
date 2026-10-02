"use server";

export async function fetchGroupedProductsServer(page = 1, size = 10) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/v1/product/grouped?page=${page}&size=${size}`,
    { cache: "force-cache" }
  );

  if (!res.ok) {
    throw new Error(`[fetchGroupedProductsServer] ${res.status}`);
  }

  const response = await res.json();
  return response?.products ?? [];
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
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/v1/product/${id}`, {
    cache: "force-cache",
  });

  if (res.status === 404) return null;

  if (!res.ok) {
    throw new Error(`[getProductById] ${res.status} for id=${id}`);
  }

  const response = await res.json();
  return response.data;
};
