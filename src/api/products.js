import { api } from "../config";
import privateApi from "../config/private";

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

export const getProductsByQuery = async (query) => {
  try {
    const data = await api.get("/product/search", {
      params: { q: query, size: 10, page: 1 },
    });
    return data.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch products by query"
    );
  }
};

export const updateProduct = async (id, body) => {
  try {
    const data = await privateApi.patch(`/product/${id}`, body, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  } catch (error) {
    console.error("Error updating product:", error);
    throw new Error(error.response?.data?.message || "Error updating product");
  }
};

export const fetchAllProducts = async (page = 1, size = 10) => {
  try {
    const { data } = await privateApi.get("/product", {
      params: {
        page,
        size,
      },
    });

    return data.data;
  } catch (error) {
    console.error("Error al obtener productos:", error);
    throw new Error(error.response?.data?.message || "Error desconocido");
  }
};
