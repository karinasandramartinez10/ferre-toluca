import { api } from "../config";

export const getSubcategories = async () => {
  try {
    const { data } = await api.get("/subcategories");
    return data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};
