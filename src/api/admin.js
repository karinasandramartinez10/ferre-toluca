import { api } from "../config";

export const postProduct = async (formData, token) => {
  try {
    const resp = await api.post("/product", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return resp;
  } catch (error) {
    console.log('err',error)
    throw new Error(error.response.data.message);
  }
};
