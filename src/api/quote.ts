import type { AxiosResponse } from "axios";
import { v4 as uuidv4 } from "uuid";
import privateApi from "../config/private";
import type {
  Quote,
  QuoteId,
  QuoteMessage,
  OrderHistoryFilters,
  UpdateQuoteStatusVars,
} from "../types/quote";
import { getApiErrorMessage } from "../utils/apiError";

export const createQuote = async (body: Record<string, unknown>): Promise<AxiosResponse> => {
  try {
    const resp = await privateApi.post("/quote", body, {
      headers: {
        "Content-Type": "application/json",
        "X-Idempotency-Key": uuidv4(),
      },
    });
    return resp;
  } catch (error) {
    console.error("Error creating quote:", error);
    throw new Error(getApiErrorMessage(error));
  }
};

export const fetchQuotes = async (
  page = 1,
  size = 10,
  status: string | null = null,
  excludedStatus: string | null = null
): Promise<Quote[]> => {
  try {
    const params: Record<string, unknown> = { page, size };

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

export const fetchQuoteById = async (quoteId: QuoteId): Promise<Quote> => {
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

export const updateQuote = async (
  id: QuoteId,
  body: Partial<UpdateQuoteStatusVars>
): Promise<AxiosResponse> => {
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
}: OrderHistoryFilters = {}) => {
  try {
    let url = `/quote/history?page=${page}&size=${size}&search=${`ORD-${search}`}&dateFrom=${dateFrom}&dateTo=${dateTo}`;
    if (status) {
      url += `&status=${encodeURIComponent(status)}`;
    }
    const data = await privateApi.get(url);
    return data.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
};

export const fetchQuoteMessages = async (quoteId: QuoteId): Promise<QuoteMessage[]> => {
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

export const sendQuoteMessage = async (
  quoteId: QuoteId,
  content: string
): Promise<QuoteMessage> => {
  try {
    const { data } = await privateApi.post(
      `/quote/${quoteId}/messages`,
      { content },
      {
        headers: {
          "Content-Type": "application/json",
          "X-Idempotency-Key": uuidv4(),
        },
      }
    );
    return data.data;
  } catch (error) {
    console.error("Error sending quote message:", error);
    throw new Error(getApiErrorMessage(error));
  }
};

export const fetchUserQuoteById = async (quoteId: QuoteId): Promise<Quote> => {
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
