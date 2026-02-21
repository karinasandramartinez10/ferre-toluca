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
    throw new Error(error.response?.data?.message || "Failed to fetch products by brand");
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

export const getGroupedProducts = async (endpoint, { page = 1, size = 10, id, q } = {}) => {
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
    throw new Error(error.response?.data?.message || `Failed to fetch from ${endpoint}`);
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
    throw new Error(error.response?.data?.message || "Failed to fetch products by categories");
  }
};

export const getProductsByQuery = async (query) => {
  try {
    const data = await api.get("/product/search", {
      params: { q: query, size: 10, page: 1 },
    });
    return data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch products by query");
  }
};

export const getProductById = async (id) => {
  try {
    const response = await api.get(`/product/${id}`);

    return response.data.data;
  } catch (error) {
    return {};
  }
};

export const updateProduct = async (id, body) => {
  try {
    const data = await privateApi.patch(`/product/${id}`, body);
    return data;
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
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

/**
 * Obtiene productos con filtros combinados.
 * @param {Object} filters - Filtros a aplicar.
 * @param {number[]} [filters.brandIds] - IDs de marcas.
 * @param {number[]} [filters.categoryIds] - IDs de categorías.
 * @param {number[]} [filters.subcategoryIds] - IDs de subcategorías.
 * @param {number[]} [filters.typeIds] - IDs de tipos.
 * @param {number[]} [filters.modelIds] - IDs de modelos.
 * @param {number[]} [filters.measureIds] - IDs de medidas.
 * @param {number[]} [filters.designIds] - IDs de diseños.
 * @param {string} [filters.q] - Búsqueda por texto.
 * @param {number} [filters.page=1] - Página.
 * @param {number} [filters.size=10] - Tamaño de página.
 * @returns {Promise<Object>} - Datos de productos filtrados.
 */
export const getFilteredProducts = async (filters = {}) => {
  try {
    const {
      brandIds,
      categoryIds,
      subcategoryIds,
      typeIds,
      modelIds,
      measureIds,
      designIds,
      q,
      page = 1,
      size = 10,
    } = filters;

    const params = { page, size };

    if (brandIds?.length) params.brandIds = brandIds.join(",");
    if (categoryIds?.length) params.categoryIds = categoryIds.join(",");
    if (subcategoryIds?.length) params.subcategoryIds = subcategoryIds.join(",");
    if (typeIds?.length) params.typeIds = typeIds.join(",");
    if (modelIds?.length) params.modelIds = modelIds.join(",");
    if (measureIds?.length) params.measureIds = measureIds.join(",");
    if (designIds?.length) params.designIds = designIds.join(",");
    if (q) params.q = q;

    const { data } = await api.get("/product/grouped", { params });

    return {
      products: data.products,
      count: data.count,
      totalPages: data.totalPages,
    };
  } catch (error) {
    console.error("Error fetching filtered products:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch filtered products");
  }
};

/**
 * Obtiene las opciones disponibles para los filtros.
 * @param {Object} currentFilters - Filtros actuales para contexto.
 * @returns {Promise<Object>} - Opciones de filtros con conteos.
 */
/**
 * Obtiene el árbol jerárquico del mega menu.
 * Solo incluye categorías/subcategorías/tipos con productos.
 * @returns {Promise<Array>} - Árbol de categorías con subcategorías y tipos anidados.
 */
export const getMenuTree = async () => {
  try {
    const { data } = await api.get("/product/menu-tree");
    return data.data;
  } catch (error) {
    console.error("Error fetching menu tree:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch menu tree");
  }
};

export const getFilterOptions = async (currentFilters = {}) => {
  try {
    const { brandIds, categoryIds, subcategoryIds, typeIds, modelIds, measureIds, designIds } =
      currentFilters;

    const params = {};

    if (brandIds?.length) params.brandIds = brandIds.join(",");
    if (categoryIds?.length) params.categoryIds = categoryIds.join(",");
    if (subcategoryIds?.length) params.subcategoryIds = subcategoryIds.join(",");
    if (typeIds?.length) params.typeIds = typeIds.join(",");
    if (modelIds?.length) params.modelIds = modelIds.join(",");
    if (measureIds?.length) params.measureIds = measureIds.join(",");
    if (designIds?.length) params.designIds = designIds.join(",");

    const { data } = await api.get("/product/filter-options", { params });

    return data.data;
  } catch (error) {
    console.error("Error fetching filter options:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch filter options");
  }
};
