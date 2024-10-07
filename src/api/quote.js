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
    console.log(error);
    throw new Error(error.response.data.message);
  }
};

export const fetchQuotes = async (token) => {
  try {
    const { data } = await api.get("/quote", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return data.data;
  } catch (error) {
    console.log(error);
    throw new Error(error.response.data.message);
  }
};

export const fetchQuoteById = async (quoteId, token) => {
  try {
    const { data } = await api.get(`/quote/${quoteId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return data.data;
  } catch (error) {
    console.log(error);
    throw new Error(
      error.response?.data?.message || "Error fetching quote by ID"
    );
  }
};
