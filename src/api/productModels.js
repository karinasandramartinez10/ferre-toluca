import { api } from "../config";

export const getProductModels = async () => {
  try {
    const { data } = await api.get("/productModels");
    return data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};
