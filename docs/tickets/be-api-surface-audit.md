# [BE] Auditoría de superficie de API: rutas sin consumidor y política de caché

**Tipo:** Chore + Feature · **Prioridad:** Media · **Área:** `api-v1/ferre-api-toluca`
**Creado:** 2026-08-21 · **Origen:** cruce FE ↔ BE hecho desde el repo del frontend

> **Este documento contiene dos piezas de trabajo independientes.** Se recomienda crear
> **dos tickets separados**: (A) limpieza de rutas sin consumidor, (B) política de caché HTTP.
> Comparten el análisis pero no dependen entre sí y tienen riesgo muy distinto.

---

## Summary

Se cruzaron todas las rutas declaradas en el backend contra todas las llamadas reales del
frontend. Resultado: **99 rutas en el BE, 71 consumidas por el FE, 0 llamadas fantasma**.

De ahí salen dos hallazgos accionables, ambos del lado del backend:

1. **25 rutas del BE no las llama nadie.** Cuatro quedaron huérfanas por el PR #17 del FE, que
   borró las funciones que las consumían.
2. **El BE no cachea absolutamente nada.** Cada petición, incluidas las de catálogo público que
   casi nunca cambian, baja a Postgres.

El dato positivo que conviene registrar: **no hay una sola llamada del FE a una ruta inexistente**.
No hay endpoints rotos esperando a fallar en producción.

## Cómo se obtuvo (reproducible)

- **Lado FE:** extracción de todos los `privateApi|api|publicApi.{get,post,put,patch,delete}` y
  `fetch()` en `src/`, normalizando params a `:id`.
- **Lado BE:** extracción de `router.{verb}` en `src/routes/*.js`, resolviendo los prefijos de
  montaje desde `src/routes/index.js`.
- **Resolución manual:** los sub-routers montados con `router.use` (`/quote/:id/logs`,
  `/quote/:id/messages`) no los detecta la extracción automática y se agregaron a mano.

**Punto ciego conocido de la extracción:** sólo ve rutas escritas como literal en el call site.
`POST /auth/login` se escapó en la primera pasada porque viaja por el wrapper genérico
`src/modules/requests/methods.js` con la ruta en una variable. Se detectó al cruzar contra el BE.
Si se repite esta auditoría, revisar a mano cualquier wrapper de `fetch` que reciba el path por
parámetro.

---

# Ticket A — Retirar rutas del BE sin consumidor

## Contexto

25 de las 99 rutas no tienen ningún consumidor en el frontend. Se agrupan en cuatro categorías,
con riesgo muy distinto entre ellas.

### A.1 — Huérfanas por el PR #17 del FE (riesgo bajo, borrar)

El PR #17 borró código muerto en el frontend. Estas rutas quedaron sin cliente como consecuencia
directa. La deuda no desapareció: se movió de repo.

| Ruta                        | Función del FE que la llamaba |
| --------------------------- | ----------------------------- |
| `GET /product/ids`          | `getProductIdsServer`         |
| `GET /product/brand/:id`    | `getProductsByBrand`          |
| `GET /product/category/:id` | `getProductsByCategory`       |
| `GET /promotion/:id`        | `getPromotion`                |

`GET /product/ids` merece nota: alimentaba `generateStaticParams` de `/product/[id]` hasta que el
FE pasó a usar `getPopularProductIdsServer` (`GET /product/popular`), que sí sigue en uso. Es
residuo de esa migración, no una regresión.

### A.2 — Familia `grouped*` por relación (revisar antes de borrar)

| Ruta                                  |
| ------------------------------------- |
| `GET /product/subCategory/:id`        |
| `GET /product/type/:id`               |
| `GET /product/groupedBrand/:id`       |
| `GET /product/groupedCategory/:id`    |
| `GET /product/groupedSubCategory/:id` |
| `GET /product/groupedType/:id`        |
| `GET /product/groupedSearch`          |

El FE resuelve todos estos casos con `GET /product/grouped` + filtros. Son una generación anterior
del mismo endpoint. **Verificar que no las consuma el repo hermano `ferretera` (Texcoco)** antes de
borrarlas: comparte backend histórico y puede seguir en la variante vieja.

### A.3 — Funcionalidad construida sin pantalla (no borrar, decidir)

Estas rutas funcionan y no tienen bug; simplemente el FE nunca les construyó UI. Borrarlas tira
trabajo hecho.

| Ruta                                                              | Qué hace                                      |
| ----------------------------------------------------------------- | --------------------------------------------- |
| `GET /settings` · `GET /settings/public` · `PATCH /settings/:key` | Módulo de configuración completo              |
| `GET /sessions` · `DELETE /sessions/:id`                          | Listar y revocar sesiones activas             |
| `GET /quote/history`                                              | Historial de cotizaciones del usuario         |
| `POST /quote/preview`                                             | Previsualizar cotización antes de crearla     |
| `POST /events/related-clicked`                                    | Telemetría de clics en productos relacionados |
| `GET /user/consent-status`                                        | Estado de consentimiento legal                |

**Decisión de producto, no técnica.** Cada una es candidata a ticket propio de FE si el negocio la
quiere. `GET /quote/history` y `POST /quote/preview` parecen las de mayor valor para el cliente.

### A.4 — Borrados que el admin no expone (revisar)

| Ruta                        |
| --------------------------- |
| `DELETE /brands/:id`        |
| `DELETE /category/:id`      |
| `DELETE /subcategories/:id` |
| `POST /notifications`       |
| `GET /user`                 |

El admin sólo crea y edita taxonomía, nunca borra. Puede ser intencional (borrar una categoría con
productos colgando es peligroso) o una pantalla pendiente. `GET /user` está superseded por
`GET /user/all`, que sí se usa.

## Acceptance Criteria — Ticket A

- [ ] Las 4 rutas de **A.1** se eliminan del BE junto con sus controllers y actions si no los
      comparte nadie más.
- [ ] Para **A.2**, se confirma contra el repo `ferretera` (Texcoco) si siguen en uso; se borran
      sólo las que no.
- [ ] Para **A.3** y **A.4**, se documenta la decisión (conservar o retirar) — no se borra sin
      confirmación de producto.
- [ ] Los tests del BE siguen verdes tras cada eliminación.
- [ ] Este documento se actualiza con lo que finalmente se retiró.

---

# Ticket B — Definir política de caché HTTP en el BE

## Contexto

**El backend no cachea nada.** Verificado:

- Cero `Cache-Control`, `Expires` o `Last-Modified` en todo `src/`.
- Sin Redis, memcached ni node-cache en `package.json`.
- Ninguno de los 14 middlewares es de caché.

Lo único vigente es el **ETag débil que Express trae por default** — `main.js` nunca hace
`app.set('etag', false)`. Devuelve 304 y ahorra ancho de banda, pero **el handler igual corre y
consulta la base**: no ahorra trabajo de servidor, que es justo lo que interesa bajo carga.

### El matiz que cambia el alcance

El frontend tiene 7 fetches server-side con `cache: "force-cache"` (Next Data Cache). Esos
**ignoran los headers HTTP**: Next guarda la respuesta indefinidamente por su cuenta y sólo la
suelta con `revalidatePath()`.

**Consecuencia:** agregar `Cache-Control` no cambiaría el comportamiento de esas 7 rutas. Cambiaría
el de las **otras 64**, que van por axios desde el navegador y sí respetan headers.

Las rutas con `force-cache` en el FE son: `/product/grouped`, `/product/popular`, `/product/:id`,
`/category?size=1000`, `/brands?size=1000`, `/subcategories/slugs`, `/product-types/slugs`.

### Candidatas reales

Máximo beneficio con mínimo riesgo — públicas, sin token, de catálogo, cambian poco y hoy pegan a
la base en cada visita:

| Ruta                                  | Frecuencia de cambio           |
| ------------------------------------- | ------------------------------ |
| `GET /category`                       | Muy baja                       |
| `GET /subcategories`                  | Muy baja                       |
| `GET /product-types`                  | Muy baja                       |
| `GET /brands`                         | Baja                           |
| `GET /measures`                       | Casi nula                      |
| `GET /productModels`                  | Baja                           |
| `GET /cfdi-uses` · `GET /tax-regimes` | Catálogos SAT, casi inmutables |
| `GET /product/filter-options`         | Baja                           |
| `GET /product/menu-tree`              | Baja                           |

## Non-goals — Ticket B

- **No cachear respuestas de `privateApi`.** Llevan token y varían por usuario; los precios
  dependen del tier (`presentList` da precios crudos a admin y sólo su tier al resto). Una caché
  compartida ahí filtra precios entre clientes. Es el riesgo serio de este ticket.
- **No tocar las 7 rutas con `force-cache`** esperando efecto: no lo tendría (ver arriba).
- **No introducir Redis** en este ticket. Empezar por headers HTTP, que no agregan infraestructura.

## Acceptance Criteria — Ticket B

- [ ] Se define y documenta un `Cache-Control` por familia de endpoint (público de catálogo vs.
      autenticado).
- [ ] Las rutas de la tabla de candidatas devuelven `Cache-Control` con un `max-age` acordado.
- [ ] Ninguna ruta que pase por `AuthGuard` devuelve caché compartida (`public`); si acaso
      `private, no-store`.
- [ ] Se verifica que crear o editar catálogo desde el admin sigue reflejándose en el storefront
      dentro del margen de tiempo elegido.
- [ ] Se decide explícitamente si mantener el ETag default de Express o desactivarlo.

## Notes

- El mapa completo de endpoints, las tres capas de caché del FE y sus invalidadores están en el
  documento navegable generado durante esta auditoría.
- Los listados de catálogo del storefront (categoría, subcategoría, tipo, marca) renderizan en el
  cliente con TanStack Query, no en el servidor. Por eso **subir productos nuevos no requiere
  revalidar nada**. Lo que sí depende de revalidación es **editar** un producto: su página pública
  vive en Data Cache con `revalidate = false`, y `useUpdateProduct.ts:34` llama a
  `revalidateProduct(id)` precisamente por eso.
