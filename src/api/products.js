import { api } from "../config";
import privateApi from "../config/private";

export const getProductsByBrand = async (id, page = 1, size = 10) => {
  try {
    const { data } = await privateApi.get(`/product/brand/${id}`, { params: { page, size } });
    return data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch products by brand");
  }
};

export const getGroupedProducts = async (endpoint, { page = 1, size = 10, id, q } = {}) => {
  try {
    const params = { page, size };

    if (q) {
      params.q = q;
    }

    const url = id ? `/product/${endpoint}/${id}` : `/product/${endpoint}`;

    const { data } = await privateApi.get(url, { params });

    return {
      data: {
        products: data.products,
        count: data.count,
        totalPages: data.totalPages,
      },
    };
  } catch (error) {
    throw new Error(error.response?.data?.message || `Failed to fetch from ${endpoint}`);
  }
};

export const getProductsByCategory = async (id, page = 1, size = 10) => {
  try {
    const { data } = await privateApi.get(`/product/category/${id}`, { params: { page, size } });
    return data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch products by categories");
  }
};

export const getProductsByQuery = async (query) => {
  try {
    const data = await privateApi.get("/product/search", {
      params: { q: query, size: 10, page: 1 },
    });
    return data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch products by query");
  }
};

export const getProductById = async (id) => {
  try {
    const response = await privateApi.get(`/product/${id}`);
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

export const getFilteredProducts = async (filters = {}) => {
  try {
    const {
      brandIds,
      categoryIds,
      subcategoryIds,
      typeIds,
      modelIds,
      measureIds,
      secondaryMeasureIds,
      designIds,
      qualifiers,
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
    if (secondaryMeasureIds?.length) params.secondaryMeasureIds = secondaryMeasureIds.join(",");
    if (designIds?.length) params.designIds = designIds.join(",");
    if (qualifiers?.length) params.qualifiers = qualifiers.join(",");
    if (q) params.q = q;

    const { data } = await privateApi.get("/product/grouped", { params });

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

export const getMenuTree = async () => {
  try {
    // Navegación, sin precios → no requiere token (evita carga autenticada extra)
    const { data } = await api.get("/product/menu-tree");
    return data.data;
  } catch (error) {
    console.error("Error fetching menu tree:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch menu tree");
  }
};

export const getFilterOptions = async (currentFilters = {}) => {
  try {
    const {
      brandIds,
      categoryIds,
      subcategoryIds,
      typeIds,
      modelIds,
      measureIds,
      secondaryMeasureIds,
      designIds,
      qualifiers,
    } = currentFilters;

    const params = {};

    if (brandIds?.length) params.brandIds = brandIds.join(",");
    if (categoryIds?.length) params.categoryIds = categoryIds.join(",");
    if (subcategoryIds?.length) params.subcategoryIds = subcategoryIds.join(",");
    if (typeIds?.length) params.typeIds = typeIds.join(",");
    if (modelIds?.length) params.modelIds = modelIds.join(",");
    if (measureIds?.length) params.measureIds = measureIds.join(",");
    if (secondaryMeasureIds?.length) params.secondaryMeasureIds = secondaryMeasureIds.join(",");
    if (designIds?.length) params.designIds = designIds.join(",");
    if (qualifiers?.length) params.qualifiers = qualifiers.join(",");

    // Facetas de filtros, sin precios → no requiere token
    const { data } = await api.get("/product/filter-options", { params });

    return data.data;
  } catch (error) {
    console.error("Error fetching filter options:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch filter options");
  }
};

export const getRelatedProducts = async (id, limit = 8) => {
  try {
    const { data } = await privateApi.get(`/product/${id}/related`, {
      params: { limit },
    });
    return data;
  } catch (error) {
    console.error("Error fetching related products:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch related products");
  }
};

export const getBatchProducts = async (ids) => {
  try {
    const { data } = await privateApi.get("/product/batch", {
      params: { ids: ids.join(",") },
    });
    return data;
  } catch (error) {
    console.error("Error fetching batch products:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch batch products");
  }
};

export const updateProductPricing = async (id, body) => {
  try {
    const { data } = await privateApi.patch(`/product/${id}/pricing`, body);
    return data;
  } catch (error) {
    console.error("Error updating product pricing:", error);
    throw error;
  }
};

export const updateProductAvailability = async (id, isAvailable) => {
  try {
    const { data } = await privateApi.patch(`/product/${id}/availability`, { isAvailable });
    return data;
  } catch (error) {
    console.error("Error updating product availability:", error);
    throw error;
  }
};
