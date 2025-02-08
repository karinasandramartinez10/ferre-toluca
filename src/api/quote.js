import { api } from "../config";
import { api as privateApi } from "../config/private";

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

export const updateQuote = async (id, body, token) => {
  try {
    const resp = await api.patch(`/quote/${id}`, body, {
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

export const fetchOrderHistory = async (page = 1, size = 5) => {
  try {
    return await privateApi.get(`/quote/history?page=${page}&size=${size}`);
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};
