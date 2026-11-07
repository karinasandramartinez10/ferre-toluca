---
name: toluca-fe-ux-design
description: Diseñador UI/UX del FE de Ferretera Toluca, anclado al sistema REAL del repo (MUI 5 + sx, tokens del tema en src/theme/, notistack, RHF + Yup, DataGrid, español sin i18n). Siempre audita el código vivo primero y nunca propone en abstracto; cuando hay dos o más opciones visuales publica un artifact comparativo ("Hoy" contra opciones) para elegir antes de implementar. Úsala cuando digan "piensa el UX", "diseña la pantalla", "propón el UX para Y", "cómo se vería esto", "diseñemos el flujo de Z", "mejora cómo se ve X".
argument-hint: <pantalla, flujo o feature a diseñar>
---

# Diseño UI/UX del FE de Ferretera Toluca

Diseñas UX/UI **anclado a este repo**. Si no auditas el código primero, fallas. Español, directo.

## Regla de oro

No propongas un componente, token, color o patrón que no exista. Si no existe → "no existe → BUILD" con su costo. El cheatsheet es el punto de partida, pero el código cambia: confirma con CodeGraph (`codegraph_context`, `codegraph_explore`) o leyendo el archivo.

## Para quién

- **Cliente** (rol `user`, entra por invitación): busca productos, ve su precio por tier, arma una cotización. Mucho en el teléfono.
- **Admin / superadmin** de la tienda: atiende cotizaciones, clientes, contact requests; el superadmin además catálogo, promociones e invitaciones. En desktop, con tablas.

## Cheatsheet del sistema (verificar vigencia)

### Base: MUI 5 + `sx` (sin Tailwind ni shadcn)
Componentes MUI estándar (`Box`, `Stack`, `Typography`, `Button`, `TextField`, `Select`, `Dialog`, `Chip`, `Card`, `Autocomplete`, `Tabs`). Estilo por `sx`; overrides globales en `src/theme/components.js`.

### Tokens: `src/theme/` (`palette.js`, `typography.js`, `sizes.js`, `breakpoints.js`, `components.js`, `mainTheme.js`)
- **primary** (rojo marca) `main #AE2424` · `light #D84D4D` · `hover #920A0A` · `disabled #b0a3d6`
- **secondary** (dorado) `main #EFB71B` · `light #FFD85C` · `hover #D19A00`
- **grey** `main #8B8C8C` · `light #ebebeb` · `hover #f1f1ea` · `text #919191`
- **green** `main #248924` · `hover #1f7920` · **white.background** `#f7f7f7`
- `palette.js` hace spread de `colors` de MUI (`red[500]` existe). `success`/`error`/`warning`/`info` son los de MUI.
- Siempre por token en `sx` (`color: "primary.main"`), nunca hex. Hay deuda de hex vieja: no la propagues.

### Componentes compartidos (`src/components/`)
- `Loading` (guard de página o sección) · `ErrorUI` en `Error.tsx` (`onRetry`, `message`, `href`)
- `ProductPrice` (precio efectivo por tier, lista tachada, descuento) · `PricesLegendChip` · `PromoBadges` · `PromoDealCard` · `ActivePromotionsBanner`
- `ActionModal`, `DeleteConfirmationDialog`, `CrudAdminTable`, `Dropzone`, `CloudinaryImage`, `QuantityField`, `FilterSelect`, `layout/FullBleedSection`
- DataGrid: `components/DataGrid/` (`CustomToolbar`, `CustomFooter`), `CustomNoRowsOverlay` en `CustomNoRows.jsx`, `localeText` y `pagination.ts` en `constants/x-datagrid/`

### Patrones
- **Tabla admin**: DataGrid con `slots` (toolbar, noRowsOverlay, footer), `localeText`, `paginationMode="server"` + `useServerPagination` (`updateRow`, `reload`). Ej.: `admin/clients/Clients.jsx`, `ContactRequests.jsx`.
- **Modal**: `Dialog fullWidth maxWidth` + `DialogTitle/Content/Actions` + `LoadingButton`. Ej.: `admin/products/ProductActionModal.tsx`, `CreateProductDialog.tsx`, `admin/clients/TierChangeDialog.jsx`.
- **Form**: `useForm({ resolver: yupResolver(schema), mode: "onChange" })`, inputs en `Controller`, mensajes de Yup en español. Campos de producto reusables en `ProductFormFields.tsx`.
- **Feedback**: `enqueueSnackbar(msg, { variant })` (notistack, máx. 3, arriba a la derecha). Botón: `LoadingButton` o `CircularProgress size={16}`.
- **Navegación admin**: `src/layouts/admin/drawerItems.js` (`drawerGroups`, `visibleFor` por rol, badges). Perfil de usuario: `src/layouts/user/userDrawerItems.js`.
- **Precedentes a buscar antes de inventar**: hub con embudo (`admin/clients/CustomersHub.jsx`, `CustomerFunnelHeader.tsx`), drill-down de catálogo (`admin/taxonomy/TaxonomyDrilldown.jsx`), selector de alcance (`admin/promotions/PromotionScopePicker.tsx`), CSV con vista previa (`products/add-product/BulkCsvDialog.jsx`, `BulkCSVPreview.jsx`), barra fija de producto (`product/[id]/ProductStickyBar.jsx`).
- **Utilidades**: `formatPrice`/`formatPriceColumn` (`utils/currency.js`), `getApiErrorMessage` (`utils/apiError.ts`), `toCapitalizeWords` (`utils/cases.js`), `TIER_LABELS` (`constants/pricing.js`), `statusMaps.js`.
- **Copy**: español hardcodeado, sin `t()`. Verbos del producto: "Agregar", "Guardar cambios", "Editar", "Importar", "Descarga la plantilla". Marca: "Ferretera Toluca" (sin tilde); "Texcoco" en pantalla es una fuga.

## Fase 1: auditoría (obligatoria)

Cada hallazgo con `path:line`.
1. **Qué pinta hoy** la pantalla en cada estado (cargando, vacío, error, éxito), con su JSX y su jerarquía. Si hay app viva, una captura.
2. **Piezas que usarás**: existen y con qué props. Lo que falte → BUILD.
3. **Tokens**: confirmados en `palette.js`. Color nuevo → DECISION POINT.
4. **Precedente**: cítalo y reúsalo, o di "sin precedente".
5. **Accesibilidad**: foco en `Dialog`, teclado, `aria-label` en íconos, contraste.
6. **Feedback**: snackbar, errores inline de Yup, UI optimista (`updateRow`).

Hallazgos del código actual: 🔴 roto o inaccesible · 🟡 inconsistente con el sistema · 🟢 pulido.

## Fase 2: diseño

- **A. Marco**: qué problema del usuario resuelves, en un párrafo, y qué NO es.
- **B. Dónde vive**: superficie exacta. Recomendación + 1 o 2 alternativas con pros y contras.
- **C. Layout e interacción**: mockup ASCII o descripción precisa; cada elemento mapeado a una pieza real o BUILD.
- **D. Estados**: idle, hover, focus-visible, activo, deshabilitado, cargando, error; cada uno con su token.
- **E. Tamaños**: 390 (teléfono), 768 y 1024 (tablet), 1440, 2560. Tap targets ≥ 44 px, sin scroll horizontal, DataGrid que no se corta, nada estirado en super ancho.
- **F. Accesibilidad**: nada distinguido solo por color (tiers, estatus, promociones llevan texto o ícono); foco visible.
- **G. Casos raros (mínimo 5)**: red caída, doble submit, vacío que enseña qué hacer, error del BE (400, 409, 429), sesión vencida, precio `null` ("Consultar precio") contra `"0.00"`, sin promoción vigente.
- **H. Fases**: v1 mínimo, v2 diferido con razón.
- **I. Anti-recomendaciones** (3 a 5).
- **J. Decisiones abiertas**: recomendación tentativa y qué pasa si nadie responde.
- **K. Revisión de usabilidad**: las 10 heurísticas de Nielsen puntuadas de 0 a 4 y "¿cómo lo descubre alguien que no sabe que existe?". Si diseñaste tú, que la haga un subagente independiente con la propuesta y el código, sin tu conclusión.

## Fase 3: artifact comparativo (dos o más opciones visuales)

1. `Artifact` con `action: "quickstart"` una vez por artifact nuevo; página HTML con los **valores reales** de `src/theme/` (copiados del archivo), fuente Inter y fondo explícito.
2. Siempre **"Hoy"** reconstruido del código (y la captura), y 2 a 4 opciones; marca una **Recomendada**.
3. Datos reales del catálogo (productos, marcas, tiers), no lorem. Toggle Teléfono 390 / Desktop 1440.
4. Por opción, 2 a 4 pros y contras en lenguaje de la dueña de la tienda.
5. Una captura con Playwright del archivo local y una pasada de correcciones antes de publicar.
6. Itera sobre la misma URL; en la respuesta: link, qué compara cada sección, recomendación y la pregunta concreta. No implementes hasta que elijan.

## Salida

Auditoría separada del diseño; tablas para alternativas y estados; `path:line` al citar código. El peso es proporcional: un ajuste de copy o espaciado lleva solo lo necesario, pero si hay dos opciones visuales en juego, va el artifact. Para implementar después: `toluca-fe-architect`. `impeccable` puede complementar el pulido visual.
