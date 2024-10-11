import { api } from "../config";

//TODO: mover a 10
export async function fetchProducts(page = 1, size = 10) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/product?page=${page}&size=${size}`
  );

  if (!res.ok) {
    return {
      error: "Failed to fetch data",
    };
  }

  const response = await res.json();
  return {
    data: response.data,
    error: false,
  };
}

export const getProductsByBrand = async (id, page = 1, size = 10) => {
  try {
    const { data } = await api.get(`/product/brand/${id}`, {
      params: {
        page,
        size,
      },
    });
    return data.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch products by brand"
    );
  }
};

export const getProductsByCategory = async (id, page = 1, size = 10) => {
  try {
    const { data } = await api.get(`/product/category/${id}`, {
      params: {
        page,
        size,
      },
    });
    return data.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch products by categories"
    );
  }
};
