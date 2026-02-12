import privateApi from "../config/private";
import { getApiErrorMessage } from "../utils/apiError";

export const createQuote = async (body) => {
  try {
    const resp = await privateApi.post("/quote", body, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return resp;
  } catch (error) {
    console.log(error);
    throw new Error(getApiErrorMessage(error));
  }
};

export const fetchQuotes = async (page = 1, size = 10, status = null, excludedStatus = null) => {
  try {
    const params = {
      page,
      size,
    };

    if (status) {
      params.status = status;
    }

    if (excludedStatus) {
      params.excludedStatus = excludedStatus;
    }

    const { data } = await privateApi.get("/quote", {
      headers: {
        "Content-Type": "application/json",
      },
      params,
    });

    return data.data;
  } catch (error) {
    console.error("Error al obtener cotizaciones:", error);
    throw new Error(getApiErrorMessage(error));
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
    throw new Error(getApiErrorMessage(error));
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
    console.error("Error updating quote:", error);
    throw error;
  }
};

export const fetchOrderHistory = async ({
  page = 1,
  size = 10,
  status = "",
  search = "",
  dateFrom = "",
  dateTo = "",
}) => {
  try {
    let url = `/quote/history?page=${page}&size=${size}&search=${`ORD-${search}`}&dateFrom=${dateFrom}&dateTo=${dateTo}`;
    if (status) {
      url += `&status=${encodeURIComponent(status)}`;
    }
    const data = await privateApi.get(url);
    return data.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

export const fetchQuoteMessages = async (quoteId) => {
  try {
    const { data } = await privateApi.get(`/quote/${quoteId}/messages`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return data.data;
  } catch (error) {
    console.error("Error al obtener mensajes:", error);
    throw new Error(getApiErrorMessage(error));
  }
};

export const sendQuoteMessage = async (quoteId, content) => {
  try {
    const { data } = await privateApi.post(
      `/quote/${quoteId}/messages`,
      { content },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return data.data;
  } catch (error) {
    console.error("Error al enviar mensaje:", error);
    throw new Error(getApiErrorMessage(error));
  }
};

export const fetchUserQuoteById = async (quoteId) => {
  try {
    const { data } = await privateApi.get(`/quote-user/${quoteId}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return data.data;
  } catch (error) {
    console.error("Error al obtener cotización de usuario:", error);
    throw new Error(getApiErrorMessage(error));
  }
};
