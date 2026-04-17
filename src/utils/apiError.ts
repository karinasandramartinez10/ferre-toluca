import type { AxiosError } from "axios";

export const getApiErrorMessage = (error: unknown): string => {
  const axiosErr = error as AxiosError<{ message?: string }>;
  const msg = axiosErr?.response?.data?.message || (error as Error)?.message;

  if (typeof msg === "string" && msg.trim().length > 0) return msg;

  return "Error desconocido";
};

export interface ApiError extends Error {
  status?: number;
  data?: Record<string, unknown>;
}

export const createApiError = (error: unknown): ApiError => {
  const axiosErr = error as AxiosError<Record<string, unknown>>;
  const err = new Error(getApiErrorMessage(error)) as ApiError;
  err.status = axiosErr?.response?.status;
  err.data = axiosErr?.response?.data as Record<string, unknown>;
  return err;
};
