import { api } from "../config";
import privateApi from "../config/private";

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

export const fetchQuotes = async (page = 1, size = 10) => {
  try {
    const { data } = await privateApi.get("/quote", {
      headers: {
        "Content-Type": "application/json",
      },
      params: {
        page,
        size,
      },
    });

    return data.data;
  } catch (error) {
    console.error("Error al obtener cotizaciones:", error);
    throw new Error(error.response?.data?.message || "Error desconocido");
  }
};

export const fetchQuoteById = async (quoteId) => {
  try {
    const { data } = await privateApi.get(`/quote/${quoteId}`, {
      headers: {
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

export const updateQuote = async (id, body) => {
  try {
    const resp = await privateApi.patch(`/quote/${id}`, body, {
      headers: {
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
