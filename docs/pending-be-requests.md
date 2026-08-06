# Requests pendientes para el Backend

> **Estado (verificado contra el BE el 2026-08-06):** solo **#1 sigue abierta**.
> Las #2–#8 están resueltas; el resumen histórico va al final del archivo.

> ✅ **El bloqueo de despliegue quedó resuelto.** La advertencia anterior decía que el FE mandaba
> FK opcionales vacías en el `PATCH` de producto y el BE de producción respondía **500**, así que
> el BE tenía que salir primero. Verificado: `fix/product-error-handling` se mergeó y **desplegó a
> producción el 2026-07-22** (PR #49), y hubo 7 deploys exitosos más desde entonces. **El FE puede
> ir a prod sin coordinar orden.**

## 1. Filtro múltiple de status en Contact Requests ⏳ ABIERTO

**Endpoint:** `GET /api/v1/contact-requests`

**Estado actual:** Acepta `?status=pending` (un solo valor)

**Lo que necesitamos:** Aceptar múltiples status separados por coma:

```
GET /api/v1/contact-requests?status=pending,contacted&page=1&size=20
GET /api/v1/contact-requests?status=invited,rejected&page=1&size=20
```

**Por qué:** El FE tiene tabs "Activas" (pending+contacted) e "Historial" (invited+rejected). Sin filtro múltiple, el FE trae todas las solicitudes y filtra client-side, lo cual rompe los counts de paginación server-side.

**Alternativa aceptable:** Si prefieres no soportar coma-separated, aceptar un param `excludeStatus`:

```
GET /api/v1/contact-requests?excludeStatus=invited,rejected&page=1&size=20
```

**Impacto FE:** Una vez que el BE implemente el filtro, estos son los cambios en el FE:

### Cambios FE cuando el BE esté listo

**1. `src/app/(admin)/admin/contact-requests/ContactRequests.jsx`**

- Agregar prop `statusFilter` al componente
- Pasar el filtro al `fetchFn`:

```js
const ContactRequests = ({ statusFilter }) => {
  const fetchFn = useCallback(
    (page, size) => getContactRequests(page, size, statusFilter),
    [statusFilter]
  );
  const { data, ... } = useServerPagination(fetchFn, { rowsKey: "contactRequests" });
```

- Quitar `getRowClassName` con `row-terminal` y los estilos de opacity/pointerEvents (ya no se mezclan activas con historial)

**2. Crear `src/app/(admin)/admin/contact-requests/ContactRequestsTabs.jsx`**

```jsx
"use client";
import { useState } from "react";
import { Box, Tabs, Tab } from "@mui/material";
import ContactRequests from "./ContactRequests";

const ContactRequestsTabs = () => {
  const [tab, setTab] = useState(0);
  return (
    <Box>
      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        sx={{ mb: 2, borderBottom: 1, borderColor: "divider" }}
      >
        <Tab label="Activas" />
        <Tab label="Historial" />
      </Tabs>
      {tab === 0 && <ContactRequests statusFilter="pending,contacted" />}
      {tab === 1 && <ContactRequests statusFilter="invited,rejected" />}
    </Box>
  );
};
export default ContactRequestsTabs;
```

**3. `src/app/(admin)/admin/contact-requests/page.jsx`**

- Cambiar import de `ContactRequests` a `ContactRequestsTabs`

**4. `src/constants/statusMaps.js`**

- `isTerminal` ya no se necesita en ContactRequests (cada tab solo muestra su tipo)

### Instrucción para copiar al BE

```
Cambio para la IA del BE: Filtro múltiple de status en Contact Requests

Endpoint afectado: GET /api/v1/contact-requests

Estado actual: El query param `status` acepta un solo valor (ej: ?status=pending).

Lo que necesitamos: Que `status` acepte múltiples valores separados por coma.

Ejemplo:
GET /api/v1/contact-requests?status=pending,contacted&page=1&size=20
→ Retorna solo solicitudes con status IN ('pending', 'contacted')

GET /api/v1/contact-requests?status=invited,rejected&page=1&size=20
→ Retorna solo solicitudes con status IN ('invited', 'rejected')

Implementación sugerida:
- Si `status` contiene coma, hacer split y usar WHERE status IN (...)
- Si no contiene coma, comportamiento actual (WHERE status = ...)
- El count y totalPages deben reflejar el filtro aplicado

Contexto: El FE tiene tabs "Activas" (pending+contacted) e "Historial" (invited+rejected) en la vista de admin. Sin este filtro, la paginación server-side no funciona correctamente porque el FE filtra client-side después del fetch.
```

---

## 9. Schema de validación (Joi) en `PATCH /product/:id` ✅ RESUELTO

El BE quiere agregar validación de schema a ese endpoint (hoy no tiene ninguna) pero su middleware
corre Joi **sin `allowUnknown`**, así que cualquier campo que el FE mande y el schema no declare
haría fallar el request con 400. Pidieron el inventario exacto de campos.

> ✅ **Implementado.** El BE aplicó el schema tal cual este inventario: `validatorSchema(productSchema.updateProduct)`
> está montado en la ruta `PATCH /product/:id`, y `src/validatons/product.js` usa `clearableFk` para las FK
> opcionales, `presentFk` para las que solo viajan con valor, y cubre las tres ramas de `modelId`/`modelName`.
> Verificado contra `main` del BE el 2026-08-06.

**Inventario entregado el 2026-07-22** — derivado de `buildProductFormData`
(`src/app/(admin)/admin/products/`), verificado contra el BE local:

| Campo                                                        | ¿Siempre?                       | `""` significa             |
| ------------------------------------------------------------ | ------------------------------- | -------------------------- |
| `color`, `qualifier`, `specifications`                       | sí                              | limpiar                    |
| `measureValue`, `secondaryMeasureValue`                      | sí                              | limpiar                    |
| `subCategoryId`, `typeId`, `measureId`, `secondaryMeasureId` | sí                              | limpiar (FK → NULL)        |
| `name`, `code`, `description`, `brandId`, `categoryId`       | solo si tienen valor            | no aplica                  |
| `modelId` + `modelName`                                      | condicional (ver abajo)         | ambos `""` = quitar modelo |
| `image`                                                      | solo si se eligió archivo nuevo | no aplica                  |
| `updatedAt`                                                  | solo si el producto lo trae     | control de concurrencia    |

Lógica del modelo (única con ramas):

- sin `modelId` y sin `modelName` → manda **ambos** en `""` (quitar modelo)
- con `modelId` → manda **solo** `modelId`
- sin `modelId` pero con `modelName` → manda **solo** `modelName` (crear modelo por nombre)

Campo de archivo: **`image`** (confirmado).

Máximo 18 campos en un request. El schema debe aceptar `""` en las 9 de la primera mitad.

---

## ✅ Resueltos (histórico)

Se conservan como registro; ninguno requiere acción del FE ni del BE.

### 2. Filtro `type` en `GET /promotion/products` — ✅ BE PR #44 (2026-07-19)

El endpoint respeta `?type=percentage` / `?type=volume_price` y `total`/`totalPages` reflejan el
filtro (verificado en vivo: sin filtro→15, `percentage`→6, `volume_price`→9). Semántica: devuelve
productos que **tienen** una promo de ese tipo en su ámbito (no la ganadora por colisión, que solo
aplica al cotizar). **FE:** sin cambios.

### 3. Búsqueda accent-insensitive — ✅ BE-001, rama `feat/search-unaccent` (2026-07-19)

Búsqueda ahora accent- y case-insensitive en nombre/código/marca (`lampara`→"Lámpara",
`plafon`→"Plafón"; `ñ`=`n`). Retrocompatible. **FE:** sin cambios (siempre mandó `q` crudo).

> Nota: el "5x2" visto en checkout NO era del BE — fue un bug FE (agregaba el `product` SSR
> ISR-cacheado en vez del dato vivo), ya rastreado y corregido aparte.

### 4. `POST /quote/preview` (calcular carrito sin persistir) — ✅ IMPLEMENTADO (2026-07-18)

Vivo, responde 200 con el shape v2 (`unitPrice`, `priceType`, `promotionId`, `promotionType`,
`promotionLabel`, `discountAmount`, `lineTotal` + totales), sin `freeUnits`. El FE ya lo consume en
el checkout.

### 5. Precio por tier — ✅ RESUELTO, era data (2026-07-19)

El pricing **sí** lee el tier del usuario. Solo el producto 248 tenía precios B/C/D cargados (el
resto cae a priceA→`appliedTier:"A"`). Prueba con prod 248 + cliente no-A → `appliedTier:"B"`,
`price` = priceB. **Acción del negocio (no código):** cargar precios B/C/D del resto de productos
cuando quieran mayoreo diferenciado. **FE:** sin cambios.

### 6. Registro de aceptación de T&C en signup — ✅ BE implementado + FE listo (2026-07-20)

El BE ahora sella la aceptación (timestamp de servidor + versión). El FE ya manda `agreeTerms:true`
en el signup (verificado E2E creando una cuenta con el checkbox activo). **Deferido a futuro:**
consumir `GET /user/consent-status` para re-pedir aceptación cuando suba la versión del documento.
