---
name: toluca-fe-review
description: Revisión post-implementación del FE de Ferretera Toluca (Next 14 App Router, MUI 5 + sx, TanStack Query, next-auth 5 beta con refresh tokens, Vitest). Corre primero el gate (lint, Vitest, tsc), manda a un revisor independiente (subagente) a recorrer el checklist del repo (capas, datos, auth y middleware, styling con el tema, TypeScript, copy, seguridad, pruebas, comentarios), verifica cada hallazgo en el código y reporta con severidad 🔴🟡🟢 + archivo:línea + arreglo. Úsala cuando digan "checa lo que hicimos", "revisa antes del commit", "review antes del PR", "detecta smells", "revisa el código", o como paso obligatorio antes de /stage. Para diseñar antes de escribir usa toluca-fe-architect.
argument-hint: <archivos, área o rama; vacío = diff de la rama contra main + archivos nuevos>
---

# Revisión del FE de Ferretera Toluca

Juzgas código YA ESCRITO y decides si está listo para commit. No diseñas (eso es `toluca-fe-architect`). Español, directo.

Las reglas del repo viven en `CLAUDE.md` (mapa de carpetas, reglas de abstracción, nombres, cero comentarios). Ojo: su sección "Pricing Mode" está vieja; no existe `withPricingMode` ni toggle Menudeo/Mayoreo, el precio es por tier (`appliedTier`).

## Severidad

- 🔴 **Bloquea el commit**: rompe una regla de capa, deja una ruta sin guard, filtra un token o dato ajeno, muestra un precio mal, rompe el refresh o el logout, o una prueba que no prueba nada.
- 🟡 **Se arregla en este PR** (o se vuelve ticket con dueño): duplicación, capa equivocada, query sin invalidar, token del tema inexistente, copy en inglés, falta la prueba de un caso real.
- 🟢 **Sugerencia**: pulido; se anota y no detiene nada.

## Flujo

1. **Alcance.** Del argumento o, por defecto, `git diff main...HEAD` + `git status` (archivos nuevos completos; modificados, solo el diff). La duplicación se busca en **todo** el repo. Si el alcance no está claro, pregunta.
2. **Gate de herramientas.** Antes de revisar:
   ```bash
   npm run lint && npm run test:run && npx tsc --noEmit
   ```
   No hay script de typecheck: `tsc --noEmit` va directo (`strict: false`). Si `tsc` ya fallaba en `main`, solo bloquean los errores nuevos (compara contra `main`). Nunca corras `next build` con `next dev` arriba: comparten `.next` y lo truena. El CI (`.github/workflows/ci.yml`) corre lint, `test:run` y build. Si algo falla, se arregla antes de revisar.
3. **Revisor independiente.** Quien escribió el código no se revisa a sí mismo: lanza un subagente `general-purpose` de solo lectura con el alcance, este checklist y `CLAUDE.md`. Pídele hallazgos con archivo:línea, principio violado y arreglo concreto, y que use CodeGraph (`codegraph_context`, `codegraph_impact`) para el impacto. No le pases tus conclusiones.
4. **Verifica cada hallazgo.** Ábrelo en el código. Si es real, conserva o ajusta su severidad; si no, descártalo y di por qué. Nunca reportes algo que no viste.
5. **Reporta y aplica.** Los arreglos triviales (un comentario sobrante, un `async` sin `await`) se aplican y se anotan; los grandes o con decisión abierta se reportan primero y esperan aprobación.
6. **Prueba lo arreglado.** Cada arreglo de lógica lleva su prueba; rómpela una vez a propósito para ver que falla. Vuelve a correr el gate.

## Checklist

### 1. Drift entre plan y código
- [ ] Lo que el plan dejó "para después" está hecho o es un ticket explícito.
- [ ] Los compromisos no planeados siguen justificados; si no, se revierten.
- [ ] Muchos smells estructurales = el diseño previo quedó corto. Dilo, es feedback para `toluca-fe-architect`.

### 2. Capas (DIP / SRP), según `CLAUDE.md`
- [ ] Componente que llama `privateApi`/`api` o una función de `src/api/` directo → pasa por un hook.
- [ ] Hook que llama axios directo → usa una función de `src/api/`. Una función de `api/` no importa React ni decide negocio.
- [ ] Presentacional que fetchea o cruza entidades → sube a hook o feature.
- [ ] `utils/` con conceptos de dominio (productId, quoteId, promotionId) → co-locar con la página o hook.
- [ ] Componente que fetchea, transforma, maneja form y pinta N secciones → pase de extracción (subcomponentes, hooks, utils).
- [ ] Cascada de `if (status === …)` → tabla en `src/constants/` (`statusMaps.js`). Bolsa de booleanos → unión de estados.
- [ ] Archivo fuera de su carpeta (mapa de `CLAUDE.md`).

### 3. Duplicación (DRY, en el segundo uso)
- [ ] Busca el **concepto** con `codegraph_search` o `rg`, no solo el nombre: `formatPrice`, `TIER_LABELS`, `statusMaps`, `useServerPagination`, `getApiErrorMessage`, `toCapitalizeWords`.
- [ ] Helper de 1 a 3 líneas con un solo uso → inlinear. Código que solo se parece se queda separado; dilo.

### 4. React y render
- [ ] `useEffect` + `setState` para algo derivable → derivar en render.
- [ ] `useMemo`/`useCallback` preventivo sin evidencia → quitar. Valor estático → constante de módulo.
- [ ] `key={index}` en listas que reordenan o filtran.
- [ ] Efecto sin cleanup (timers, listeners, `socket.io-client`).
- [ ] Modal, drawer, DataGrid o carrusel pesado sin `dynamic()`.
- [ ] `localStorage`/`js-cookie` directo en componente → hook (precedentes: `useRecentlyViewed`, `context/cookieConsent`).
- [ ] `"use client"` en un archivo que no lo necesita, o una página RSC convertida en client sin razón.

### 5. Datos (TanStack Query)
- [ ] Mutation que no invalida la key correcta (factory `queryKeys` de `src/constants/queryKeys.ts`).
- [ ] Key literal inline o `staleTime` inline → `queryKeys` y `staleTimes`/`gcTimes` de `src/constants/queryConfig.js`.
- [ ] Estado del servidor copiado en `useState`; waterfalls con `enabled` sin dependencia real.
- [ ] `size` alto como parche de paginación → deuda que se reporta; en admin el patrón es server-side (`useServerPagination`).
- [ ] Re-derivar lo que el BE manda (precio efectivo `appliedTier`, totales, estatus, promoción vigente).

### 6. Auth, sesión y middleware (propio de Toluca)
- [ ] Página nueva: `classifyRoute` (`src/routes.js`) la clasifica bien y `src/__tests__/routes/guardedPages.test.ts` la cubre. Ruta solo de superadmin → en `superAdminPrefixes`. Pública → en `publicRoutes`.
- [ ] Protección de ruta hecha en el componente en vez de `src/middleware.js`; esconder un botón no es seguridad.
- [ ] `auth()` en el root layout → 🔴: vuelve dinámico todo el árbol y truena `/product/[id]` on-demand.
- [ ] El `refresh_token` vive en la raíz del JWT, nunca en `token.data` (lo expone el `session` callback). Nada de `signOut()` dentro del `jwt` callback (bucle).
- [ ] Logout de usuario → `logout()` de `src/lib/logout.ts` (revoca la sesión, limpia el token y hace `signOut`). `signOut` directo solo para sesiones ya muertas (`GlobalAuthWatcher`).
- [ ] Token leído fuera de `getAccessToken`/la sesión, o en servidor (el espejo en memoria devuelve `null` ahí a propósito).
- [ ] Llamada nueva con `fetch` que se salta el interceptor de `privateApi` (pierde el reintento tras refresh).
- [ ] Roles como string suelto en componentes → constantes y `visibleFor` de `src/layouts/admin/drawerItems.js`.

### 7. Errores y feedback
- [ ] Mutation sin `onError`, o con mensaje genérico en vez de `getApiErrorMessage(error)`.
- [ ] Función de `api/` que lanza `new Error(string)` → `createApiError(error)` (`src/utils/apiError.ts`).
- [ ] Manejo duplicado (`onError` + `try/catch`); 401/403/409/429 tratados antes del catch genérico.
- [ ] Feedback con `console.*` o `alert` → `enqueueSnackbar` (notistack).

### 8. Styling (MUI 5 + `sx` y `src/theme/`)
- [ ] Hex en `sx` → token (`primary.main`, `grey.light`, `secondary.main`). No propagues la deuda de hex vieja.
- [ ] Token que no existe en `palette.js` (resuelve a `undefined` en silencio).
- [ ] `px`/`rem` para tipografía → `<Typography variant>` o `typography.js`; números mágicos de layout → `sizes.js` o `src/constants/layout.js`.
- [ ] Mismo bloque `sx` en 2 lugares → componente compartido u override en `theme/components.js`.
- [ ] Loader equivocado: página `<Loading />`, botón `LoadingButton`, error con `<ErrorUI onRetry />`.

### 9. TypeScript (`strict: false`, migración gradual)
- [ ] `as`/`as any` sin razón que tapa un desajuste → se arregla en `src/types/`. Tipo nuevo verificado contra la respuesta viva del BE.
- [ ] Fallback (`?? []`, `|| ""`) sobre un valor garantizado; `async` sin `await`; exports sin consumidor.
- [ ] Archivo `.js` nuevo con forma de dominio conocida → `.ts`/`.tsx`.

### 10. Copy (español, sin i18n)
- [ ] Texto visible o mensaje de Yup en inglés o sin mensaje → español.
- [ ] Contacto hardcodeado → `src/constants/businessInfo.js`. Cualquier "Texcoco" o `ferreteriatexcoco@` → 🔴 fuga del fork.

### 11. Seguridad del cliente
- [ ] `dangerouslySetInnerHTML` sin contenido confiable; secreto fuera de `NEXT_PUBLIC_*` llegando al bundle.
- [ ] `callbackUrl` o destino de navegación tomado de la URL sin validar (open redirect).
- [ ] Dato de otro usuario resuelto o pintado en la UI.

### 12. Pruebas (Vitest + Testing Library)
- [ ] Lógica nueva sin prueba en `src/__tests__/` (misma ruta que en `src/`).
- [ ] Mock de internals en vez del borde (`src/api/`); falta `createQueryWrapper` con React Query.
- [ ] MUI `Select`/`Autocomplete` probados con setters nativos (no propagan a RHF) → `userEvent`.
- [ ] Prueba que codifica un bug, o aserción débil (`toBeDefined()` con forma conocida).

### 13. Comentarios (cero por defecto)
- [ ] JSDoc, comentario que repite el código, historia o número de ticket → borrar.
- [ ] Solo el porqué no derivable (restricción oculta, workaround de librería, orden crítico). Si escribiste el código, cita cada comentario nuevo y justifícalo.
- [ ] Comentarios o tipos agregados a código que no cambiaste → revertir.

## Gate antes del commit

- [ ] Lint, `test:run` y `tsc --noEmit` en verde (sin errores nuevos contra `main`).
- [ ] 🔴 arreglados; 🟡 arreglados o en ticket.
- [ ] Cambio en precios, promociones, auth o permisos → `toluca-fe-smoke` además de las pruebas.
- [ ] Algo que necesita al BE → redactado al estilo de `docs/pending-be-requests.md` o con `/validate-fe`.
- [ ] Siguiente paso: `/stage` y `/create-pr`.

## Reporte

Primero 🔴, luego 🟡 y 🟢: archivo:línea, smell, principio (SRP, DIP, DRY, capa, auth, perf, seguridad, copy) y arreglo. Secciones sin hallazgos en una línea ("limpio"). Hallazgos descartados en la verificación, con su razón en una línea. Al final: resultado del gate, totales por severidad, qué se aplicó, qué queda abierto y la recomendación (listo para commit, aplicar arreglos o decisión del usuario).

## Reglas

- Nunca "se ve bien" sin recorrer cada sección.
- Nunca proponer refactor de código correcto solo porque existe otra forma, ni agregar features.
- Consulta Context7 antes de afirmar APIs de Next, MUI, TanStack Query, next-auth, RHF o Yup.
