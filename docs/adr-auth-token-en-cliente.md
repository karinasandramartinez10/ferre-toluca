# ADR — El access_token vive en el cliente (y por qué no hicimos BFF)

**Fecha:** 2026-07-22 · **Estado:** aceptada · **Ámbito:** `src/config/private.ts`, `src/lib/authToken.ts`

## Contexto

El navegador llama directo a `api.ferreteratoluca.com` con `Authorization: Bearer`. Para eso el
`access_token` tiene que estar disponible en cliente, y hoy se expone en `/api/auth/session`
(cualquiera con la sesión abierta lo lee desde la consola).

Auth.js **no recomienda esta arquitectura**. Su guía de _integrating third-party backends_ propone
un Route Handler de Next que hace de proxy y adjunta el token con `auth()` server-side, de modo que
nunca llegue al navegador.

El interceptor de axios llamaba `getSession()` en **cada** request. Eso cuesta un round-trip a
`/api/auth/session` (endpoint con cabeceras anti-caché por diseño) más un segundo request, porque
`getSession()` emite un broadcast que hace refetchear al `SessionProvider`. Medido: ~18 ms de
latencia bloqueante y ~2 requests extra por cada llamada a la API.

## Decisión

Mantener la arquitectura actual y **leer el token de un espejo en memoria**
(`src/lib/authToken.ts`, alimentado por `AuthTokenSync` desde `useSession()`), con `getSession()`
sólo como fallback para la ventana inicial.

Es una desviación consciente del patrón documentado: sigue su _dirección_ (tomar el token de
`useSession`, no de `getSession` por request) pero no su _mecanismo_ (Auth.js no documenta un
store de módulo; aunque internamente ellos usan la misma técnica en `__NEXTAUTH._session`).

## Alternativas descartadas

**Revertir y dejar `getSession()` por request.** Paga latencia e invocaciones serverless sin ganar
nada; el token queda igual de expuesto.

**BFF / proxy por Route Handler.** Es la opción canónica y la única que resuelve la exposición del
token. Descartada _por ahora_ por su costo operativo, no por esfuerzo de implementación (sería un
catch-all + cambiar `baseURL`, sin tocar los 17 módulos de `src/api/`):

- **Dinero:** hoy el tráfico de API no toca Vercel. Con BFF, cada llamada pasa a ser invocación
  serverless + ancho de banda facturable.
- **Latencia:** las funciones corren en `iad1` (Virginia) y el BE está tras Cloudflare. Un usuario
  en Toluca cambiaría un salto corto por dos largos, en cada request.
- **Riesgo técnico:** el form de producto acepta imágenes de hasta 5 MB y las funciones de Vercel
  tienen tope de request body en ese orden — habría que sacar esa ruta del proxy.

## Riesgo asumido

Un XSS podría exfiltrar el token y usarlo **7 días** desde cualquier máquina. Mitigantes actuales:
superficie de XSS baja (cero `dangerouslySetInnerHTML` en el repo; React escapa por defecto) y el
BE tiene blacklist de tokens funcional.

⚠️ **Pero esa blacklist no se está usando:** el FE hace `signOut()` de next-auth y nunca llama a
`GET /auth/logout` del BE, así que el token no se revoca al cerrar sesión. Ver #10 en
`pending-be-requests.md`. Cerrar ese hueco es más barato y más efectivo que el BFF.

## Cuándo revisar esta decisión

- Si el BE agrega refresh de token: el espejo deja de ser equivalente al `getSession()` de hoy
  (hoy lo es porque `src/auth.js` asigna `access_token` sólo en el login y no lo renueva).
- Si sube el perfil de riesgo (datos de pago, PII sensible) o el tráfico hace que el ahorro de
  invocaciones deje de compensar.
- Si aparece `dangerouslySetInnerHTML` o contenido de terceros inyectado en el DOM.
