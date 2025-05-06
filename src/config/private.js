import axios from "axios";
import { getSession } from "next-auth/react";
import { authEvents } from "../lib/authEvents";
import { EVENTS_EMITERS } from "../lib/events";

let inMemoryToken;

export const privateApi = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BACKEND_API_URL}`,
});

privateApi.interceptors.request.use(
  async (config) => {
    try {
      if (!inMemoryToken) {
        const session = await getSession();
        inMemoryToken = session?.user?.access_token ?? null;
      }
      if (inMemoryToken) {
        config.headers.Authorization = `Bearer ${inMemoryToken}`;
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
