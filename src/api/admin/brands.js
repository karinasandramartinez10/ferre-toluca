import api from "../../config";
import privateApi from "../../config/private";

export const getBrands = async (params) => {
  try {
    const { data } = await api.get("/brands", { params });
    return data.data;
  } catch (error) {
    console.log(error);
    throw new Error(error.response.data.message);
  }
};

export const createBrand = async (formData) => {
  try {
    const resp = await privateApi.post("/brands", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return resp;
  } catch (error) {
    console.log(error);
    throw new Error(error.response.data.message);
  }
};

export const updateBrand = async (id, formData) => {
  try {
    const resp = await privateApi.put(`/brands/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return resp;
  } catch (error) {
    console.log(error);
    throw new Error(error.response.data.message);
  }
};

