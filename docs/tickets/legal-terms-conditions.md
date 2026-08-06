# [Legal] Reescribir Términos y Condiciones (modelo de cotización + PROFECO/LFPC)

**Tipo:** Feature · **Prioridad:** Alta (bloqueante de cumplimiento para prod)
**Área:** `(main)/terms-conditions` · **Creado:** 2026-07-18

> Ticket hermano: **[Legal] Aviso de Privacidad + Cookies** (`docs/tickets/legal-privacy-cookies.md`) — mismos gates legales.

> **Estado (2026-07-20): CÓDIGO COMPLETO (PR #10).** T&C reescritos (13 secciones: modelo de
> cotización, precios/IVA, promociones/tiers, cuenta, entrega, pagos, devoluciones/garantías, IP,
> jurisdicción + PROFECO, enlace al Aviso). Datos vía `businessInfo.js` + placeholders inline.
> Signup ya exige aceptar T&C + Aviso (`agreeTerms`). **Único gate restante = datos de la dueña +
> revisión de abogado**, centralizado en **`docs/tickets/legal-owner-checklist.md`**. No necesita
> más trabajo de código.

---

## Summary

Los Términos y Condiciones de Ferretera Toluca (`src/app/(main)/terms-conditions/page.jsx`) son una **plantilla genérica de 6 secciones** que **no refleja el modelo de negocio real (venta por cotización, no compra directa con pago)** ni cubre los mínimos de la **LFPC / PROFECO** para comercio electrónico en México. Este ticket reescribe el documento con input legal del negocio.

## Contexto / gaps detectados (análisis 2026-07-18)

**🔴 De fondo:**

- **No identifica al titular:** falta razón social, domicilio fiscal y RFC (PROFECO/LFPC exigen proveedor identificable).
- **No refleja el modelo de cotización:** el sitio opera con "Solicitar cotización", pero los términos hablan de "órdenes de compra". Falta aclarar que los **precios son referenciales**, que la **cotización no constituye una venta** hasta confirmación, y su **vigencia**.
- **Precios, IVA y vigencia:** no dice si los precios incluyen IVA, que pueden cambiar, ni vigencia de precios/cotizaciones.
- **Promociones y precios por tipo de cliente:** con el motor de promociones (volumen + tiers A/B/C/D), faltan términos de vigencia/condiciones de promos y de precios diferenciados por tipo de cliente (mayoreo).
- **Devoluciones, cancelaciones y garantías:** ausentes (la LFPC obliga garantías; ferretería maneja garantías de fabricante).
- **Referencia al Aviso de Privacidad:** no enlaza la política de datos (obligatorio por LFPDPPP).
- **Ley aplicable y jurisdicción:** falta legislación mexicana + tribunales competentes (Toluca, Edo. de México) + PROFECO para controversias.

**🟡 Menores:**

- Obligaciones de la cuenta de usuario (registro, veracidad de datos, responsabilidad de credenciales).
- Entrega/envíos (cobertura, tiempos, costos — hay link "Tiempos de entrega" sin respaldo).
- Métodos de pago (si/cuando aplica).
- **Fecha de última actualización** (ausente).

## Acceptance Criteria

- [ ] Identificación del titular (razón social, domicilio, RFC).
- [ ] Sección que describe el flujo de **cotización**: precios referenciales, la cotización no es venta vinculante hasta confirmación, vigencia de la cotización.
- [ ] Precios: moneda, si incluyen IVA, posibilidad de cambio, vigencia.
- [ ] Sección de promociones y precios por tipo de cliente (mayoreo) sujetos a condiciones/vigencia.
- [ ] Devoluciones, cancelaciones y garantías (alineadas a LFPC + garantías de fabricante).
- [ ] Cuenta de usuario: registro, veracidad, responsabilidad de credenciales.
- [ ] Entrega/envíos: cobertura, tiempos y costos (o referencia clara a la página correspondiente).
- [ ] Métodos de pago (cuando aplique).
- [ ] Enlace al Aviso de Privacidad.
- [ ] Ley aplicable (legislación mexicana) y jurisdicción (tribunales de Toluca / PROFECO).
- [ ] Fecha de última actualización.
- [ ] Datos de contacto consistentes con footer (correo real de Toluca + teléfono).

## Definition of Done

- [ ] Texto revisado por el negocio antes de publicar (ver gates en Notes).
- [ ] Página renderiza; `tsc --noEmit` limpio; sin regresiones en layout `(main)`.

## Notes

**Gated en input legal del negocio (no inventar):**

- Razón social, RFC, domicilio fiscal.
- Política concreta de devoluciones/cancelaciones/garantías.
- Jurisdicción/tribunales competentes.

**Dependencias:**

- Debe enlazar el Aviso de Privacidad del ticket hermano.
- Contacto: usar el correo real de Toluca (`ferretera.toluca10@gmail.com`) y el teléfono `+52 720 788 8704` — ya actualizados en el footer.
