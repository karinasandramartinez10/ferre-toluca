import { api } from "../config";
import { api as privateApi } from "../config/private";

export const getSubcategories = async () => {
  try {
    const { data } = await api.get("/subcategories");
    return data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

export const deleteSubcategory = async (id) => {
  try {
    const response = await privateApi.delete(`/subcategories/${id}`);
    return response;
  } catch (error) {
    throw new Error(error.response.data.message || "Error deleting category");
  }
};

export const createSubcategory = async (body) => {
  try {
    const resp = await privateApi.post("/subcategories", body);
    return resp;
  } catch (error) {
    console.log(error);
    throw new Error(error.response.data.message);
  }
};

export const updateSubcategory = async (id, body) => {
  try {
    const resp = await privateApi.put(`/subcategories/${id}`, body);
    return resp;
  } catch (error) {
    console.log(error);
    throw new Error(error.response.data.message);
  }
};
