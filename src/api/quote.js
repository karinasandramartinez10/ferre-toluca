import { api } from "../config";

export const createQuote = async (body, token) => {
  try {
    const resp = await api.post("/quote", body, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return resp;
  } catch (error) {
    console.log(error)
    throw new Error(error.response.data.message);
  }
};
