import { api } from "../config";
import { getApiErrorMessage } from "../utils/apiError";

export const getProductModels = async (brandId) => {
  try {
    const { data } = await api.get("/productModels", {
      params: brandId ? { brandId } : {},
    });
    return data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
};
