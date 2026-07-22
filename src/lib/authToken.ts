// Espejo en memoria del access_token de la sesión, alimentado por AuthTokenSync.
// Permite que el interceptor de axios lo lea de forma síncrona, en vez de pagar
// un fetch a /api/auth/session por cada request.
let accessToken: string | null = null;

export function setAccessToken(token: string | null): void {
  accessToken = token;
}

export function getAccessToken(): string | null {
  return accessToken;
}

export function clearAccessToken(): void {
  accessToken = null;
}
