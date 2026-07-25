import axios, { type InternalAxiosRequestConfig } from "axios";
import { getSession } from "next-auth/react";
import { authEvents } from "../lib/authEvents";
import { EVENTS_EMITERS } from "../lib/events";
import { getAccessToken, setAccessToken, clearAccessToken } from "../lib/authToken";

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
    const original = error.config as
      | (InternalAxiosRequestConfig & { _retried?: boolean })
      | undefined;

    // El reintento tras refrescar volvió a dar 401 → la sesión está muerta: revocada
    // (el access seguía vigente, así que el `jwt` callback no rotó y reintentamos con
    // el mismo token), o el token nuevo también fue rechazado. Cerrar sesión.
    if (error.response?.status === 401 && original?._retried) {
      authEvents.emit(EVENTS_EMITERS.AUTH.SESSION_EXPIRED);
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && original && !original._retried) {
      original._retried = true; // sin esto un 401 persistente entra en bucle
      clearAccessToken();

      // Leer la sesión corre el `jwt` callback de NextAuth → refresh + rotación.
      // getSessionDeduplicated colapsa las ráfagas de 401 (N queries en paralelo,
      // prefetch-on-hover) en una sola rotación.
      const session = await getSessionDeduplicated();

      if (!session?.error && session?.user?.access_token) {
        setAccessToken(session.user.access_token);
        original.headers.Authorization = `Bearer ${session.user.access_token}`;
        return privateApi(original); // reintentar una vez con el token nuevo
      }

      // El refresh falló (session.error) o no hay sesión → logout aguas abajo.
      authEvents.emit(EVENTS_EMITERS.AUTH.SESSION_EXPIRED);
    }

    return Promise.reject(error);
  }
);

export default privateApi;
