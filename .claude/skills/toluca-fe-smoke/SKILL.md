---
name: toluca-fe-smoke
description: Smoke E2E del FE de Ferretera Toluca con Playwright contra el FE y la API locales (ferre-api-toluca con su base de desarrollo, nunca producción). Pregunta antes puertos, rama y cuentas; levanta el entorno (worktree si hace falta, .env.local, CORS temporal), revisa los datos que ya hay, deriva escenarios y casos raros, corre el flujo real por rol revisando red y consola en cada paso, toma capturas para el PR, barre responsive, deja una matriz de resultados y limpia todo al final. Úsala cuando digan "haz el smoke de X", "prueba la feature", "valídalo de punta a punta", "smoke test", "probemos contra el BE".
argument-hint: <feature, ticket o rama a probar (ej. promociones, checkout, invitaciones)>
---

# Smoke E2E del FE de Ferretera Toluca

Corres un smoke real, sin mocks, pensando como alguien que quiere romper la feature, y dejas evidencia reproducible. Español, directo.

## Reglas de oro

- **Nunca contra producción.** Ni la API de las tiendas ni su base. Solo la API local (`~/Documents/freelancer/api-v1/ferre-api-toluca`) con su base de desarrollo. `/ssm` no es parte del smoke.
- **Live-first.** La forma de un endpoint sale de la respuesta viva, no del tipo local. Si algo no responde o la feature no está en la API que corre, no inventes: repórtalo.
- **Nunca escribas contraseñas** en esta skill, en la matriz, en commits ni en el chat de vuelta. Pídelas al usuario cada vez.

## Fase 0: preguntar antes de levantar nada

Pregunta al usuario, en un solo mensaje:
1. **Puertos** del FE y de la API. No asumas 3000 ni 3001: puede tenerlos ocupados o no quererlos.
2. **Qué código** se prueba: ¿está en la rama actual del FE (y de la API)? Si no, se usa un worktree.
3. **Cuentas de prueba** (al menos un `user` y un `admin`/`superadmin`) y sus contraseñas.
4. **Permiso para modificar** la base local (crear promociones, invitaciones, cotizaciones). Sin permiso, solo lectura.

## Fase 1: entorno

1. **Base de la API es local.** Antes de arrancarla, confirma el host sin imprimir credenciales:
   ```bash
   cd ~/Documents/freelancer/api-v1/ferre-api-toluca
   node -e 'require("dotenv").config();const u=new URL(process.env.DATABASE_URL);console.log(u.hostname,u.port,u.pathname)'
   ```
   Si no es `localhost`/`127.0.0.1` (o un contenedor local), detente.
2. **Worktree** (solo si el código no está en la rama del usuario): `git worktree add <scratchpad>/wt/smoke-<rama> <rama>` en el repo que toque (FE, API o ambos), copia `.env` y `.env.local` desde el working tree original y corre `npm ci`. Anota cada copia: se borra al final.
3. **`.env.local` del FE**: `NEXT_PUBLIC_BACKEND_API_URL=http://localhost:<puerto-api>` **sin** `/api/v1` (el FE se lo agrega en `src/config/`; el `.env.example` lo trae mal). `NEXTAUTH_URL=http://localhost:<puerto-fe>/`. Si el archivo ya existía, guarda su contenido para restaurarlo.
4. **CORS**: en desarrollo la API solo acepta `http://localhost:3000` (`allowedOrigins` en `main.js`). Si el FE no corre en 3000, agrega su origen ahí **temporalmente** y anótalo; se revierte en la limpieza.
5. **Arranca** la API (`PORT=<puerto-api> npm run dev`) y el FE (`npm run dev -- -p <puerto-fe>`), en background. Confirma `curl -s localhost:<puerto-api>/health`.
6. Nunca `next build` con `next dev` arriba (comparten `.next`).

## Fase 2: recon de datos

- Antes de crear nada, revisa qué ya existe con la API viva (curl autenticado con el `access_token` de `/api/auth/session` tras loguear): productos con tier, promociones activas, clientes, invitaciones, contact requests, cotizaciones por estatus.
- Confirma rol de cada cuenta en `/api/auth/session`.
- Decide **reusar contra crear**. Si hay que crear y el usuario lo permitió: primero por la UI (el flujo real); si la UI no puede producir el estado, por curl a la API, y se anota en la matriz que se forzó.

## Fase 3: escenarios

1. **S1…Sn**, flujo feliz por capacidad: disparador, rol y qué afirmar (copy en español, navegación, snackbar, estado).
2. **Casos raros (mínimo 5)**, los que apliquen:
   - Precio por tier (`appliedTier`): tachado de lista, descuento, `"0.00"` pinta `$0.00` y solo `null` pinta "Consultar precio". Un `$0.00` silencioso es un hueco de forma del BE.
   - Promoción vigente contra vencida; producto en dos promociones.
   - Registro solo por invitación: `/auth/signup` sin `token` muestra `NoInvitation`; token vencido o usado.
   - Sesión: access vencido → refresh silencioso y reintento único; sesión revocada desde otra pestaña → logout con snackbar; 429 en refresh no mata la sesión.
   - Permisos: `user` en `/admin/*`, `admin` en ruta de superadmin (`/admin/products`, `/admin/brands`, `/admin/taxonomy`, `/admin/invitations`).
   - Red caída (`<ErrorUI onRetry>`), doble submit, tabla vacía (`CustomNoRowsOverlay`), paginación server-side.
3. **Transversales X1…Xn**: sin polling ni fetch por fila, sin llamadas legacy, consola sin errores nuevos, invalidaciones correctas.

Matriz en `<scratchpad>/smoke-<rama>/matriz.md`: Entorno · Cuentas (sin contraseñas) · Escenarios (ID | disparador | rol | qué se afirma) · Transversales · Responsive · Resultados · Bugs · Backlog UI/UX · No cubierto.

## Fase 4: Playwright

Carga las herramientas `mcp__playwright__browser_*` con ToolSearch en una sola llamada.
- **Espera a que cargue** antes de llenar formularios: Next en dev compila cada ruta en su primera visita. Usa `browser_wait_for` sobre un texto de la página, no un sleep.
- **Redirecciones del middleware** (`src/middleware.js`): ruta de auth con sesión o ruta admin sin rol → `/`; `/user/*` sin rol `user` o superadmin sin rol → `/admin/quotes`; privada sin sesión → `/auth/login?callbackUrl=…`. Caer en `/` sin querer casi siempre es que no hay sesión: revisa `/api/auth/session`.
- **Login**: `/auth/login`, email y contraseña, "Iniciar sesión". next-auth responde 200 aunque falle: la prueba es `session.user` en `/api/auth/session`.
- **Un rol a la vez**: un contexto comparte cookie. Login A → actúa → logout (botón real) → sesión vacía → login B.
- **MUI + RHF**: clics reales y escritura secuencial; los setters nativos no propagan a RHF. Los `Select` se eligen con clic en la opción.
- **En cada paso**: `browser_network_requests` (qué se llama, cuándo y qué no), `browser_network_request` para status y body de las llamadas clave, `browser_console_messages` al cerrar el paso.
- **Capturas** de cada escenario y estado clave (render, vacío, error, caso raro) con nombre `S1-…png`; muévelas a `<scratchpad>/smoke-<rama>/` para el PR.
- **Responsive**: 390×844, 768×1024, 1024×1366, 1440×900 y 2560×1440 con `browser_resize`. Busca scroll horizontal, DataGrid cortado, texto truncado, tap targets chicos, drawer móvil, grids de `ProductCard` que no colapsan, contenido estirado en super ancho.

## Fase 5: resultados

- Resultados por fila: ✅ pasa · 🔄 parcial · ⚠️ bloqueado · 🐛 bug · ⬜ pendiente, con evidencia (status, campo clave, captura).
- **Bugs**: 🔴 rompe el flujo, precio o dato mal, fuga de datos ajenos · 🟡 inconsistencia, error en consola, copy crudo · 🟢 pulido. Los del FE triviales se arreglan siguiendo `CLAUDE.md`; los del BE se redactan al estilo de `docs/pending-be-requests.md` o con `/validate-fe`.
- **Causa raíz sobre parche**: si pasa pero hay un defecto de fondo (un `as` que tapa un campo, un estado que solo se alcanzó por API), no lo declares verde.
- Lo no probado va en "No cubierto", separando lo que es solo del FE de lo que necesita al BE.

## Fase 6: limpieza (obligatoria, aunque el smoke falle)

- [ ] FE y API detenidos (solo los procesos que levantaste; confirma con `lsof -i :<puerto>`).
- [ ] CORS de `main.js` revertido: `git -C ~/Documents/freelancer/api-v1/ferre-api-toluca diff main.js` vacío.
- [ ] `.env.local` restaurado a como estaba.
- [ ] Worktrees borrados (`git worktree remove`) junto con los `.env` copiados; `git worktree list` limpio.
- [ ] Carpeta `.playwright-mcp/` borrada después de mover las capturas.
- [ ] Datos de prueba creados: se borran o se quedan, según lo que diga el usuario.

## Reglas

- Nunca fabriques un resultado ni marques "listo" si un criterio depende de algo que no está vivo en la API.
- Nunca commitees capturas, `.env` ni la matriz.
- Peso proporcional: un cambio de copy lleva 2 o 3 casos; precios, promociones, checkout o auth llevan la matriz completa.
