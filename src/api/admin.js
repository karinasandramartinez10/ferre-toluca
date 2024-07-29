import { api } from "../config";

export const postProduct = async (body, token) => {
  try {
    const resp = await api.post("/product", body, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return resp;
  } catch (error) {
    console.log(error)
    throw new Error(error.response.data.message);
  }
};
