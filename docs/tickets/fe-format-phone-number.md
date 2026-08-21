# formatPhoneNumber rompe con teléfonos en formato internacional

**Status:** Resuelto · **Prioridad:** Media · **Creado:** 2026-08-21 · **Resuelto:** 2026-08-21
· **Rama:** `fix/format-phone-number-e164`

## Qué pasa

`formatPhoneNumber` (`src/utils/phoneNumber.js`) intenta formatear con `numeral`:

```js
numeral(phoneNumber).format("000-000-0000");
```

`numeral` formatea **números**, no cadenas con máscara telefónica, así que el patrón con guiones
nunca se aplica. Medido:

```
numeral("+52 55 1234 5678").format("000-000-0000")  ->  "525512345678"
numeral("+525512345678").format("000-000-0000")     ->  "525512345678"
numeral("5512345678").format("000-000-0000")        ->  "5512345678"
```

Es decir, el helper **nunca** produjo el formato que su nombre promete, ni siquiera con 10 dígitos
nacionales. Con E.164 además se come el `+` y deja el `52` pegado, que es cuando se vuelve
visiblemente incorrecto.

Se usa en la columna **Teléfono** del grid de cotizaciones del admin
(`src/app/(admin)/admin/quotes/columns.jsx:141`).

## Por qué importa ahora

Desde que se alineó la validación de teléfono entre FE y BE (agosto 2026), **todos los registros
nuevos guardan E.164** (`+52…`). El resultado pasa de "10 dígitos sin guiones" (feo pero legible) a
"`525512345678`" (con la lada país pegada y sin `+`), que ya se lee como dato incorrecto.

No es una regresión de aquel cambio: el helper ya estaba roto. Aquel cambio solo volvió normal el
caso donde el defecto se nota.

## Fix sugerido

Reemplazar `numeral` por el formateo de `libphonenumber-js`, que ya es dependencia directa del
proyecto:

```js
parsePhoneNumberFromString(value)?.formatNational() ?? value;
```

Verificado: devuelve `55 1234 5678` tanto para `+525512345678` como para `+52 55 1234 5678`.
Ojo con los valores sin `+` (`"5512345678"` **no parsea** y cae al fallback) y con `null`. Actualizar
`src/__tests__/utils/phoneNumber.test.ts`: hoy no fija el formato, solo hace
`expect(result).toContain("5512345678")`, y por eso el defecto pasó desapercibido. El test nuevo
debe afirmar la cadena exacta.

## Cómo se resolvió

`src/utils/phoneNumber.ts` (migrado de `.js`) reemplaza `numeral` por `libphonenumber-js`, que ya
era dependencia directa. `numeral` quedó sin usos y se desinstaló.

Al medir el comportamiento real aparecieron dos casos que este ticket no contemplaba:

- **`null`, `undefined` y `""` devolvían `"0000000000"`.** Un cliente sin teléfono mostraba un
  número falso y creíble en el grid; el `|| ""` del consumidor no lo atrapaba porque esa cadena es
  truthy. Ahora devuelve `""`.
- **`+5215551234567` parsea pero no es válido**, y `formatNational()` lo dejaba en `"15551234567"`.
  Ahora los valores no formateables se devuelven tal como están guardados, sin mutilarlos.

Dos decisiones sobre lo propuesto:

- Se parsea con `TEL_COUNTRY` como país por defecto, así que los legacy de 10 dígitos sin `+`
  (`"5512345678"`) también se formatean, en vez de caer al fallback como anticipaba el ticket.
- Los números extranjeros usan `formatInternational()`, no `formatNational()`: un `+33…` mostrado
  como `"01 23 45 67 89"` se lee como número local y llevaría a marcar mal.

`src/__tests__/utils/phoneNumber.test.ts` afirma la cadena exacta en los 10 casos, incluidos los
vacíos y los no formateables.
