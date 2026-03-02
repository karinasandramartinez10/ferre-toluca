import type { AxiosError } from "axios";

export const getApiErrorMessage = (error: unknown): string => {
  const axiosErr = error as AxiosError<{ message?: string }>;
  const msg = axiosErr?.response?.data?.message || (error as Error)?.message;

  if (typeof msg === "string" && msg.trim().length > 0) return msg;

  return "Error desconocido";
};
