import { api } from "../config";
import privateApi from "../config/private";

export const getCategories = async (params) => {
  try {
    const { data } = await api.get("/category", { params });
    return data.data;
  } catch (error) {
    console.log(error);
    throw new Error(error.response.data.message);
  }
};

export const deleteCategory = async (id) => {
  try {
    const response = await privateApi.delete(`/category/${id}`);
    return response;
  } catch (error) {
    throw new Error(error.response.data.message || "Error deleting category");
  }
};

export const createCategory = async (body) => {
  try {
    const resp = await privateApi.post("/category", body);
    return resp;
  } catch (error) {
    console.log(error);
    throw new Error(error.response.data.message);
  }
};

export const updateCategory = async (id, body) => {
  try {
    const resp = await privateApi.put(`/category/${id}`, body);
    return resp;
  } catch (error) {
    console.log(error);
    throw new Error(error.response.data.message);
  }
};
