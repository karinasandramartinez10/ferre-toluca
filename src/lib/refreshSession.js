import { refreshToken as callRefresh } from "../api/refresh";

export const REFRESH_ERROR = "RefreshTokenError";

// Renueva ~20 min antes de expirar, para que el poll proactivo del SessionProvider
// atrape el token dentro de esa ventana y no lleguemos nunca a un 401 en el happy path.
export const REFRESH_THRESHOLD_MS = 20 * 60 * 1000;

// Si /auth/refresh responde 429 (rate limit por multi-pestaña) aparcamos la rotación
// este tiempo en vez de matar la sesión: un rate limit no es una sesión muerta.
const RATE_LIMIT_PARK_MS = 30 * 1000;

// El refresh_token vive en la RAÍZ del token, nunca en `token.data`. El `session`
// callback sólo expone `token.data`, así que el refresh jamás llega al navegador.
export async function rotate(token) {
  try {
    const tokens = await callRefresh(token.refresh_token);
    return {
      ...token,
      data: {
        ...token.data,
        access_token: tokens.access_token,
        expires_at: Math.floor(Date.now() / 1000) + tokens.expires_in,
      },
      refresh_token: tokens.refresh_token,
      error: undefined,
      retry_refresh_at: undefined,
    };
  } catch (error) {
    if (error?.status === 429) {
      return { ...token, error: undefined, retry_refresh_at: Date.now() + RATE_LIMIT_PARK_MS };
    }
    // Nunca signOut() desde aquí: entra en bucle. Marcamos el token; el `session`
    // callback expone el error y el cliente cierra sesión (GlobalAuthWatcher).
    return { ...token, error: REFRESH_ERROR };
  }
}

export async function jwtCallback({ token, user }) {
  // Login inicial: guarda access en `data` y refresh en la raíz.
  if (user) {
    return {
      data: {
        id: user.id,
        email: user.email,
        role: user.role,
        access_token: user.access_token,
        expires_at: user.expires_at,
      },
      refresh_token: user.refresh_token,
    };
  }

  // Access aún lejos de expirar: nada que hacer.
  if (token.data?.expires_at && Date.now() < token.data.expires_at * 1000 - REFRESH_THRESHOLD_MS) {
    return token;
  }

  // Rotación aparcada por un 429 previo: esperar a que abra la ventana.
  if (token.retry_refresh_at && Date.now() < token.retry_refresh_at) {
    return token;
  }

  if (!token.refresh_token) return { ...token, error: REFRESH_ERROR };
  return rotate(token);
}
