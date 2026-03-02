import type { AxiosResponse } from "axios";
import { api } from "../config";
import privateApi from "../config/private";
import { getApiErrorMessage } from "../utils/apiError";
import type { CategoriesParams, CategoriesResponse, CategoryBody } from "../types/catalog";

export const getCategories = async (params: CategoriesParams): Promise<CategoriesResponse> => {
  try {
    const { data } = await api.get("/category", { params });
    return data.data;
  } catch (error) {
    console.log(error);
    throw new Error(getApiErrorMessage(error));
  }
};

export const deleteCategory = async (id: string): Promise<AxiosResponse> => {
  try {
    const response = await privateApi.delete(`/category/${id}`);
    return response;
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
};

export const createCategory = async (body: CategoryBody): Promise<AxiosResponse> => {
  try {
    const resp = await privateApi.post("/category", body);
    return resp;
  } catch (error) {
    console.log(error);
    throw new Error(getApiErrorMessage(error));
  }
};

export const updateCategory = async (id: string, body: CategoryBody): Promise<AxiosResponse> => {
  try {
    const resp = await privateApi.put(`/category/${id}`, body);
    return resp;
  } catch (error) {
    console.log(error);
    throw new Error(getApiErrorMessage(error));
  }
};
