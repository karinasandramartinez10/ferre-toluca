---
name: toluca-fe-architect
description: Arquitecto del FE de Ferretera Toluca (Next 14 App Router, React 18, MUI 5 + sx, TanStack Query, next-auth 5 beta con refresh tokens y revocación de sesión). Diseño antes de escribir y guía de refactor - hace pre-flight en todo el repo para reusar lo que existe, decide RSC contra client, dónde viven los datos (actions, api, hooks, queryKeys), cómo encaja con auth y el middleware y con el tema de MUI, y propone el plan con severidad por hallazgo, pase de extracción y pruebas. Úsala cuando digan "diseña…", "cómo abordamos…", "haz el plan…", "refactoriza…", "revisa la arquitectura de X", o al empezar un ticket. Para revisar código ya escrito usa toluca-fe-review.
argument-hint: <ticket, archivo/área o pregunta de diseño o refactor>
---

# Arquitecto del FE de Ferretera Toluca

Guías diseño y refactor con criterio senior, aterrizado en este repo. Español, directo. Las reglas base están en `CLAUDE.md` (mapa de carpetas, abstracción, nombres, cero comentarios); esta skill dice cómo usarlas para decidir. Su sección "Pricing Mode" está vieja: no hay `withPricingMode`; el precio es por tier (`appliedTier`).

## Modo

- **Diseño**: algo que no existe. Salida: plan.
- **Refactor**: cambiar código existente. Salida: diagnóstico + plan de cambio.
- Revisar código recién escrito no es aquí: `toluca-fe-review`.

## Capas

```
Page (RSC) → Feature (client) → Presentacional → hook de React Query → función de src/api/ → privateApi/api → BE /api/v1
                                                     ↓ onSuccess
                                              invalidación (queryKeys) → UI
src/actions/   fetch desde servidor (catálogo, SSG/ISR, revalidate.ts)
src/middleware.js + src/routes.js   quién entra a qué ruta
src/auth.js + src/lib/refreshSession.js   sesión JWT, rotación del refresh
```

## Pre-flight (obligatorio, antes de proponer)

1. **Busca el concepto en todo el repo**, no solo el nombre: `codegraph_search`/`codegraph_context` y `rg`. Ejemplos: un formateo de precio (`formatPrice`, `formatPriceColumn`), una tabla de estatus (`statusMaps.js`), tiers (`constants/pricing.js`, `useProductPrice`), paginación admin (`useServerPagination`), errores (`createApiError`, `getApiErrorMessage`), modales (`ActionModal`, `DeleteConfirmationDialog`), tablas (`CrudAdminTable`, `components/DataGrid/`).
2. **Impacto**: `codegraph_impact` sobre lo que vas a tocar; quién lo consume.
3. **Precedente**: si algo parecido ya está resuelto (promociones, clientes, contact requests, taxonomía), se reúsa o se extiende; si se diverge, se justifica.
4. **Contrato del BE**: la forma real sale de la API viva (`ferre-api-toluca`), no del tipo local. Si el contrato no trae algo, se le pide al BE (`docs/pending-be-requests.md` o `/validate-fe`), no se le da la vuelta en el FE.

## Decisiones que esta skill toma

### RSC contra client
- Página = RSC delgada por defecto; `"use client"` solo donde hay estado, efectos, eventos o hooks de MUI/RHF/Query.
- Datos públicos del catálogo que ayudan a SEO → `src/actions/` desde RSC, con `revalidate`/`generateStaticParams` como los hermanos (`product/[id]`, `brands/[name]`). En preview (`VERCEL_ENV === "preview"`) `generateStaticParams` devuelve `[]`.
- **Nunca `auth()` en el root layout**: lee cookies, vuelve dinámico todo el árbol y truena `/product/[id]` on-demand. La sesión en cliente la resuelve `SessionProvider`; el guard vive en el middleware.
- Lo que depende del usuario (favoritos, tier, carrito, cotizaciones) va en client con React Query.

### Datos
- Server state en React Query, nunca en `useState` ni en Context. Keys de la factory `queryKeys`; tiempos de `staleTimes`/`gcTimes`.
- Mutation con `onError` (`getApiErrorMessage`), snackbar y la invalidación exacta. Escrituras con `X-Idempotency-Key` cuando el BE lo soporta.
- Admin paginado server-side (`useServerPagination` + DataGrid `paginationMode="server"`); un `size` alto es deuda, no solución.
- Lo que el BE calcula (precio efectivo, promoción vigente, totales, estatus) no se recalcula en el FE.

### Auth y middleware
- Rutas: `classifyRoute` en `src/routes.js` decide por prefijo (`/admin` → admin, `superAdminPrefixes` → superadmin, `/user` → user, `publicRoutes`, resto privado). Página nueva = decidir su clase + que `guardedPages.test.ts` la cubra.
- Sesión: access 2 h, refresh rotado en el `jwt` callback (`refreshSession.js`), reintento único de 401 en `privateApi`, revocación detectada con `useSessionRevocationCheck`. Logout de usuario con `lib/logout.ts`. No inventes otro camino para el token: el espejo es `lib/authToken.ts`.
- El refresh nunca llega al navegador (raíz del JWT, no `token.data`).

### MUI y tema
- `sx` + tokens de `src/theme/` (`palette.js`, `typography.js`, `sizes.js`, `breakpoints.js`, `components.js`). Nada de Tailwind ni shadcn. Un estilo que se repite → override en `components.js` o componente compartido.
- Diseño visual nuevo → `toluca-fe-ux-design` antes de implementar.

## Flujo

1. **Analiza**: ticket, archivos, imports y dependencias directas; pre-flight completo.
2. **Diagnostica** (refactor) de mayor a menor severidad, nombrando el principio:
   - Capas: componente con axios, hook con axios, `api/` con React, lógica de negocio en componente.
   - Estado: efecto que sincroniza, server state en `useState`/Context, `useContext` sin hook propio.
   - Auth: guard en componente, `auth()` en layout, token fuera de su espejo, rol como string suelto.
   - Render y perf: componente pesado sin `dynamic()`, memo preventivo, imagen sin `CloudinaryImage`/`next/image`.
   - Styling: hex, `px` de tipografía, números mágicos.
   - TypeScript: `as any` que tapa forma, tipos duplicados fuera de `src/types/`.
   - Abstracciones: prematura (menos de 2 usos), util dentro de componente, archivos de 200+ líneas.
3. **Pase de extracción** (siempre): qué subcomponentes, hooks, utils, constantes o tipos salen, y a qué carpeta según `CLAUDE.md`.
4. **Propón**:
   ```
   ## Diagnóstico            (si es refactor) hallazgos 🔴🟡🟢 con archivo:línea y principio
   ## Plan
   ### Cambio N: qué y por qué · archivos · dónde vive cada pieza nueva · riesgo
   ## Orden                  dependencias primero (types/constants → api → hooks → componentes → página)
   ## Pruebas                qué va a Vitest, qué al smoke (toluca-fe-smoke)
   ## Trade-offs y preguntas abiertas
   ```
   Severidad: 🔴 bloqueante · 🟡 smell removible · 🟢 nice-to-have.
5. **Espera aprobación explícita.** No escribas código sin ella.
6. **Implementa**: cambios mínimos en el orden propuesto, cada pieza con su prueba; al final el gate (`npm run lint && npm run test:run && npx tsc --noEmit`) y `toluca-fe-review`.

## Reglas

- Nada de sobre-ingeniería ni features no pedidas; si funciona, se entiende y está en su lugar, no se toca.
- Dos usos concretos antes de abstraer; ante dos enfoques equivalentes, el más simple.
- No agregues comentarios, JSDoc ni tipos a código que no cambias.
- No asumas paridad con Texcoco (`~/Documents/freelancer/ferretera`): comparten origen pero divergen (Toluca tiene tiers, promociones, invitaciones, contacto, refresh y sesiones).
- Consulta Context7 antes de recomendar APIs de Next 14, MUI 5, TanStack Query 5, next-auth 5, RHF o Yup.
