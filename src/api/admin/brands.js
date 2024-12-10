import api from "../../config";

export const getBrands = async () => {
  try {
    const { data } = await api.get("/brands");
    return data.data;
  } catch (error) {
    console.log(error);
    throw new Error(error.response.data.message);
  }
};

export const createBrand = async (formData, token) => {
  try {
    const resp = await api.post("/brands", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return resp;
  } catch (error) {
    console.log(error);
    throw new Error(error.response.data.message);
  }
};

export const updateBrand = async (id, formData, token) => {
  try {
    const resp = await api.put(`/brands/${id}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return resp;
  } catch (error) {
    console.log(error);
    throw new Error(error.response.data.message);
  }
};

export const deleteBrand = async (id, token) => {
  try {
    const response = await api.delete(`/brands/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    throw new Error(error.response.data.message || "Error deleting brand");
  }
};
