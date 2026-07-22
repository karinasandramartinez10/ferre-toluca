import axios, { type InternalAxiosRequestConfig } from "axios";
import { getSession } from "next-auth/react";
import { authEvents } from "../lib/authEvents";
import { EVENTS_EMITERS } from "../lib/events";
import { getAccessToken } from "../lib/authToken";

let activeSessionPromise: ReturnType<typeof getSession> | null = null;

function getSessionDeduplicated() {
  if (!activeSessionPromise) {
    activeSessionPromise = getSession().finally(() => {
      activeSessionPromise = null;
    });
  }
  return activeSessionPromise;
}

export const privateApi = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/v1`,
});

privateApi.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      // Desviación consciente del patrón de Auth.js: su guía para APIs externas propone
      // un Route Handler que haga de proxy y adjunte el token con `auth()` server-side.
      // Aquí el navegador llama al BE directo, así que el token tiene que vivir en
      // cliente; leerlo de memoria evita pagar un fetch a /api/auth/session por request.
      //
      // AuthTokenSync mantiene el token en memoria; getSession() sólo cubre la ventana
      // inicial, antes de que SessionProvider resuelva la sesión en el primer render.
      let token = getAccessToken();
      if (!token) {
        const session = await getSessionDeduplicated();
        token = session?.user?.access_token ?? null;
      }
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
