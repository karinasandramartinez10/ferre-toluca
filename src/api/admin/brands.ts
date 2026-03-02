import type { AxiosResponse } from "axios";
import api from "../../config";
import privateApi from "../../config/private";
import { getApiErrorMessage } from "../../utils/apiError";
import type { BrandsParams, BrandsResponse } from "../../types/catalog";

export const getBrands = async (params: BrandsParams): Promise<BrandsResponse> => {
  try {
    const { data } = await api.get("/brands", { params });
    return data.data;
  } catch (error) {
    console.log(error);
    throw new Error(getApiErrorMessage(error));
  }
};

export const createBrand = async (formData: FormData): Promise<AxiosResponse> => {
  try {
    const resp = await privateApi.post("/brands", formData);
    return resp;
  } catch (error) {
    console.log(error);
    throw new Error(getApiErrorMessage(error));
  }
};

export const updateBrand = async (id: string, formData: FormData): Promise<AxiosResponse> => {
  try {
    const resp = await privateApi.put(`/brands/${id}`, formData);
    return resp;
  } catch (error) {
    console.log(error);
    throw new Error(getApiErrorMessage(error));
  }
};
