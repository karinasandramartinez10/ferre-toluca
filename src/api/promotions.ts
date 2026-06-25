import { api } from "../config";
import privateApi from "../config/private";
import { createApiError, getApiErrorMessage } from "../utils/apiError";
import type { ActivePromotion, Promotion, PromotionsResult } from "../types/promotion";

export const getPromotions = async (
  page = 1,
  size = 20,
  filters: Record<string, unknown> = {}
): Promise<PromotionsResult> => {
  try {
    const { data } = await privateApi.get("/promotion", { params: { page, size, ...filters } });
    return data.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
};

export const getPromotion = async (id: number | string): Promise<Promotion> => {
  try {
    const { data } = await privateApi.get(`/promotion/${id}`);
    return data.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
};

export const createPromotion = async (body: Record<string, unknown>): Promise<Promotion> => {
  try {
    const { data } = await privateApi.post("/promotion", body);
    return data.data;
  } catch (error) {
    throw createApiError(error);
  }
};

export const updatePromotion = async (
  id: number | string,
  body: Record<string, unknown>
): Promise<Promotion> => {
  try {
    const { data } = await privateApi.patch(`/promotion/${id}`, body);
    return data.data;
  } catch (error) {
    throw createApiError(error);
  }
};

export const deletePromotion = async (id: number | string): Promise<void> => {
  try {
    await privateApi.delete(`/promotion/${id}`);
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
};

// Público: promos vigentes con scopeName hidratado (banner). Sin precios → sin token.
export const getActivePromotions = async (): Promise<ActivePromotion[]> => {
  try {
    const { data } = await api.get("/promotion/active");
    return data.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
};

// Productos en promo (página "ofertas"). Trae precios → con token para el tier del cliente.
export const getPromotionProducts = async (page = 1, size = 20, type?: string) => {
  try {
    const params: Record<string, unknown> = { page, size };
    if (type) params.type = type;
    const { data } = await privateApi.get("/promotion/products", { params });
    return data.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
};
