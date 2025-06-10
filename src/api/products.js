import { api } from "../config";
import privateApi from "../config/private";

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

/**
 * Obtiene productos agrupados usando el endpoint especificado.
 * @param {string} endpoint - Endpoint dinámico: 'groupedBrand', 'groupedCategory', 'grouped', etc.
 * @param {Object} options - Parámetros opcionales.
 * @param {number} [options.page=1] - Página.
 * @param {number} [options.size=10] - Tamaño de página.
 * @param {string|number} [options.id] - ID para brand o category, según aplique.
 * @returns {Promise<Object>} - Datos de productos agrupados.
 */

export const getGroupedProducts = async (
  endpoint,
  { page = 1, size = 10, id, q } = {}
) => {
  try {
    const params = {
      page,
      size,
    };

    if (q) {
      params.q = q;
    }

    const url = id ? `/product/${endpoint}/${id}` : `/product/${endpoint}`;

    const { data } = await api.get(url, { params });

    return {
      data: {
        products: data.products,
        count: data.count,
        totalPages: data.totalPages,
      },
    };
  } catch (error) {
    console.log("er", error);
    throw new Error(
      error.response?.data?.message || `Failed to fetch from ${endpoint}`
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

export const getProductById = async (id) => {
  try {
    const response = await api.get(`/product/${id}`);

    return response.data.data
  } catch (error) {
    return {};
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
