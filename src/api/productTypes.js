import { api } from "../config";

export const getProductTypes = async () => {
  try {
    const { data } = await api.get("/product-types");
    return data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};
