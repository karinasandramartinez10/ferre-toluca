# UX Refactor — Product Detail (`/product/[id]`)

## Contexto

La página de detalle actual presenta problemas de jerarquía visual, balance
de layout y claridad informativa que impactan la conversión y la UX en
general. Este documento enumera los problemas detectados y propone un
refactor priorizado.

Ruta afectada: `src/app/(main)/product/[id]/ProductPage.jsx` y componentes
co-localizados (`ProductActions`, `ProductOverview`, `ProductAttributes`,
`VariantSelector`, `MainSpecs`, `ProductFeatures`, `ProductImage`).

---

## Problemas detectados

### 1. Jerarquía visual rota

- `Consultar precio` aparece en itálica como body text — el elemento
  comercialmente más importante carece de peso visual.
- El brand (`Colorantes Mariposa`) aparece arriba del título y además en
  el breadcrumb — información duplicada.
- El SKU (`SKU 606`) queda visualmente más prominente que el precio. El
  usuario final rara vez consulta el SKU en esta vista.

### 2. Balance de columnas pobre

- Columna izquierda: solo la imagen (~200px) con mucho whitespace debajo.
- Columna derecha: concentra brand, título, SKU, precio, chips, 21
  swatches de color, variante, quantity stepper y CTA.
- El bloque `Única variante · 32 g` en el extremo derecho queda huérfano,
  desconectado del resto del layout.

### 3. Color swatches confusos

- 21 círculos sin estado visible: no hay ring/borde indicando cuál
  corresponde al producto actual (`Azul Marino`).
- Si son solo informativos, su peso visual domina y compite con el CTA.
- Si son interactivos, falta feedback (hover, focus, tooltip con nombre).

### 4. Duplicación de información

- Las secciones `Acerca de este producto`, `Características` y
  `Especificaciones principales` tienen semántica solapada.
- `Color` y `Medida` aparecen en la sección de especificaciones pero ya
  se muestran arriba en los swatches y el chip de variante.

### 5. Imagen de producto subdimensionada

- Tamaño pequeño, sin zoom, sin galería ni thumbnails alternos.
- Para una ferretería donde el cliente quiere ver detalle del empaque o
  de la pieza, es un bloqueador importante.

### 6. CTA sin jerarquía clara

- `Añadir a la orden`, quantity stepper y botón de favorito conviven en
  la misma línea sin prioridad visual.
- No existe sticky CTA en mobile para scroll largo.
- Falta microcopy de stock, disponibilidad o tiempo de entrega cerca
  del CTA.

### 7. Navegación secundaria compitiendo

- La barra `Categorías / Automotriz / Control De Plagas / Controles De
Gas` encima de los breadcrumbs roba atención en una página de detalle.

### 8. Falta de refuerzo del modo de precio

- El toggle Menudeo/Mayoreo vive en el navbar, pero el bloque de precio
  no indica en qué modo está el valor mostrado. Riesgo de confusión
  cuando el precio cambia "solo" al alternar.

---

## Propuesta de refactor

### Must-have — prioridad alta

#### P1. Bloque de precio con jerarquía real

- Monto en tipografía grande (heading-scale).
- Chip de modo al lado (`Mayoreo` / `Menudeo`) reforzando el contexto.
- Cuando el precio del modo activo es `null`, mostrar `Consultar precio`
  como texto destacado (sin CTA ni redirect). El producto sigue siendo
  añadible al carrito: la cotización se resuelve en el flujo de checkout
  (ya existente), no en la página de detalle.
- Archivo a tocar: `src/components/ProductPrice.jsx`.

#### P2. Reorganizar la columna derecha

Orden propuesto de arriba a abajo:

1. Brand (sutil, caption).
2. Título del producto.
3. Bloque de precio (P1).
4. Descripción corta (1-2 líneas, teaser de la sección de abajo).
5. Selector de variantes (solo si hay >1).
6. Quantity + CTA primario.
7. Acciones secundarias (favorito, compartir).
8. Microcopy de disponibilidad/entrega.

Archivo a tocar: `src/app/(main)/product/[id]/ProductPage.jsx`.

#### P3. Highlight del color actual

- Ring y borde en el swatch del producto actual.
- Tooltip con el nombre del color en hover.
- Focus visible para accesibilidad (keyboard navigation).
- Archivo a tocar: `src/app/(main)/product/[id]/VariantSelector/VariantSelector.jsx`.

#### P4. Consolidar secciones descriptivas

- Fusionar `Acerca de este producto` y `Características` en una sola
  sección `Descripción`.
- Mantener `Especificaciones` como tabla, removiendo filas duplicadas
  (`Color`, `Medida`) que ya aparecen arriba.
- Archivos a tocar: `ProductFeatures.jsx`, `MainSpecs.jsx` (valorar si
  alguno se elimina).

### Nice-to-have — prioridad media

#### P5. Ampliar imagen y preparar galería

- Container con aspect ratio 1:1, mínimo ~400px en desktop.
- Estructura lista para thumbnails aunque hoy solo exista una imagen.
- Archivo a tocar: `src/app/(main)/product/[id]/ProductImage.jsx`.

#### P6. Sticky CTA en mobile

- Barra inferior fija con precio resumido + botón `Añadir a la orden`.
- Archivo a tocar: `src/app/(main)/product/[id]/ProductActions.jsx`
  (nuevo wrapper responsive en `ProductPage.jsx`).

#### P7. Degradar el SKU

- Mover al bloque de especificaciones.
- Archivo a tocar: `src/app/(main)/product/[id]/ProductOverview.jsx`.

#### P8. Variante única como chip informativo

- Ocultar el selector cuando hay una sola medida, o mostrarlo como chip
  discreto no interactivo.
- Archivo a tocar: `VariantSelector.jsx`.

### Extras — prioridad baja

#### P9. Productos relacionados

- Carrusel al final de la página con productos de la misma subcategoría.

#### P10. Indicador de disponibilidad/stock

- Badge junto al CTA (`En stock`, `Últimas piezas`, `Agotado`).

#### P11. Truncar nombres largos en la nav de categorías

- Aplicar `ellipsis` en los chips de `NavigationLinks` para nombres de
  categoría largos (`Control De Plagas`, `Controles De Gas`, etc.) que
  rompen el layout en ciertos anchos.
- `maxWidth` responsive + `text-overflow: ellipsis` + `Tooltip` con el
  nombre completo al hover.
- Archivo a tocar: `src/components/NavigationMenu/NavigationLinks.js`.

---

## Accesibilidad

- Todos los swatches deben tener `aria-label` con el nombre del color.
- Min touch target de 40px en los controles principales.
- Focus visible en swatches y chips navegables.
- Revisar contraste de `Consultar precio` si se mantiene como estado
  (AA ≥ 4.5:1).

---

## Orden de implementación sugerido

1. **Sprint 1 (P1–P4)**: bloque de precio, reorganización, swatches
   highlighted, consolidación de secciones. Mínimo viable de producción.
2. **Sprint 2 (P5–P8)**: galería, sticky CTA, SKU degradado, variante
   única. Pulido de experiencia.
3. **Backlog (P9–P11)**: relacionados, stock, nav secundaria.

## Métricas para validar

- Tiempo hasta el clic en `Añadir a la orden`.
- Tasa de rebote en product detail.
- Conversión `add to cart` segmentada por modo (Menudeo vs Mayoreo).
- Clics en `Consultar precio` cuando aplique.
