// Espejo en memoria del access_token de la sesión, alimentado por AuthTokenSync.
// Permite que el interceptor de axios lo lea de forma síncrona, en vez de pagar
// un fetch a /api/auth/session por cada request.
//
// Es válido cachearlo porque el `jwt` callback de src/auth.js sólo asigna
// `access_token` en el login: no se renueva durante la sesión. Si alguna vez se
// agrega refresh de token, este espejo deja de ser equivalente y hay que revisarlo.
let accessToken: string | null = null;

export function setAccessToken(token: string | null): void {
  accessToken = token;
}

export function getAccessToken(): string | null {
  // En servidor el módulo se comparte entre requests de distintos usuarios:
  // devolver el token cacheado ahí filtraría la sesión de uno a otro.
  if (typeof window === "undefined") return null;
  return accessToken;
}

export function clearAccessToken(): void {
  accessToken = null;
}
