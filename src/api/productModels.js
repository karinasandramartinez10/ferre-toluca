import { api } from "../config";

export const getProductModels = async (brandId) => {
  try {
    const { data } = await api.get("/productModels", {
      params: brandId ? { brandId } : {},
    });
    return data;
  } catch (error) {
    throw new Error(error.response.data.message || "Error fetching models");
  }
};
