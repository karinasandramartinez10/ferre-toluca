import axios from "axios";
import { getSession } from "next-auth/react";
import { authEvents } from "../lib/authEvents";
import { EVENTS_EMITERS } from "../lib/events";

export const privateApi = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/v1`,
});

privateApi.interceptors.request.use(
  async (config) => {
    try {
      const session = await getSession();
      const token = session?.user?.access_token ?? null;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error(`Error setting token in request header ${error}`);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

privateApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      console.warn("[Auth] Token vencido o inválido. Cerrando sesión...");
      authEvents.emit(EVENTS_EMITERS.AUTH.SESSION_EXPIRED);
    }
    return Promise.reject(error); // sigue lanzando el error para el componente
  }
);

export default privateApi;
