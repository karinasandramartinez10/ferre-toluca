import type { AxiosResponse } from "axios";
import { api } from "../config";
import privateApi from "../config/private";
import { getApiErrorMessage } from "../utils/apiError";
import type { SubcategoriesParams, SubcategoriesResponse, SubcategoryBody } from "../types/catalog";

export const getSubcategories = async (
  params: SubcategoriesParams
): Promise<SubcategoriesResponse> => {
  try {
    const { data } = await api.get("/subcategories", { params });
    return data.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
};

export const deleteSubcategory = async (id: string): Promise<AxiosResponse> => {
  try {
    const response = await privateApi.delete(`/subcategories/${id}`);
    return response;
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
};

export const createSubcategory = async (body: SubcategoryBody): Promise<AxiosResponse> => {
  try {
    const resp = await privateApi.post("/subcategories", body);
    return resp;
  } catch (error) {
    console.log(error);
    throw new Error(getApiErrorMessage(error));
  }
};

export const updateSubcategory = async (
  id: string,
  body: SubcategoryBody
): Promise<AxiosResponse> => {
  try {
    const resp = await privateApi.put(`/subcategories/${id}`, body);
    return resp;
  } catch (error) {
    console.log(error);
    throw new Error(getApiErrorMessage(error));
  }
};
