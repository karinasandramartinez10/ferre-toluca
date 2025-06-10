"use server";

export async function fetchGroupedProductsServer(page = 1, size = 10) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/product/grouped?page=${page}&size=${size}`
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

export const getProductById = async (id) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/product/${id}`
    );

    const response = await res.json();
    return response.data
  } catch (error) {
    return {};
  }
};
