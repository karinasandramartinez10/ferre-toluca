# [Legal] Aviso de Privacidad (LFPDPPP) + Política de Cookies + Banner de consentimiento

**Tipo:** Feature · **Prioridad:** Alta (bloqueante de cumplimiento para prod)
**Área:** `(main)` legal + Footer · **Creado:** 2026-07-18

> **Estado (2026-07-20): CÓDIGO COMPLETO — A·B·C·D implementados (PR #9 banner, PR #10 páginas).**
>
> - ✅ **A. Aviso de Privacidad (LFPDPPP)** — reescrito con estructura de 8 secciones, datos vía
>   `src/constants/businessInfo.js` (placeholders centralizados).
> - ✅ **B. Política de Cookies** — página nueva `(main)/cookies-policy` con categorías del banner.
> - ✅ **C. Banner de consentimiento** — banner (Aceptar / Rechazar / Configurar) + dialog por
>   categoría + persistencia (`cookie_consent`, 1 año) + reabrible desde footer + `hasConsent()`.
> - ✅ **D. Enlaces** — footer enlaza Aviso + Política de Cookies; banner enlaza ambas; T&C enlaza
>   el Aviso.
>
> **Único gate restante = datos legales de la dueña + revisión de abogado** (los placeholders de
> `businessInfo.js`: razón social, RFC, domicilio, responsable de datos, terceros). Todo lo pendiente
> está centralizado en **`docs/tickets/legal-owner-checklist.md`** — este ticket no necesita más
> trabajo de código.

> Ticket hermano: **[Legal] Reescribir Términos y Condiciones** (ver `docs/tickets/legal-terms-conditions.md` si se crea) — mismos gates legales.

---

## Summary

Ferretería Toluca (e-commerce Next.js, México, opera por **cotización**) hoy tiene un Aviso de Privacidad que es una **plantilla genérica de 5 secciones que NO cumple la LFPDPPP** (`src/app/(main)/privacy-statement/page.jsx`), **no tiene Política de Cookies**, y **no tiene banner de consentimiento de cookies**. Esto es un riesgo legal (INAI/LFPDPPP) y bloquea el cutover de DNS a producción. Este ticket cubre reescribir el aviso conforme a ley, crear la política de cookies, e implementar el banner de consentimiento con persistencia y bloqueo de cookies no esenciales.

## Contexto / gaps actuales

El aviso actual **omite** los elementos mínimos que exige la LFPDPPP (arts. 15-16 y su Reglamento):

- Identidad y **domicilio** del responsable (razón social, domicilio fiscal).
- **Datos personales** que se recaban (y si hay **datos sensibles**).
- **Finalidades** primarias vs **secundarias** (con mecanismo para negar las secundarias).
- **Transferencias** de datos a terceros y su consentimiento.
- **Procedimiento concreto** para ejercer derechos **ARCO** (hoy solo dice "contáctenos").
- Mecanismo para **revocar el consentimiento**.
- Uso de **cookies / web beacons** y cómo deshabilitarlas.
- Procedimiento de **cambios** al aviso.
- **Departamento / persona** de datos personales y su contacto.

## Acceptance Criteria

### A. Aviso de Privacidad conforme a LFPDPPP (`privacy-statement/page.jsx`)

- [ ] Identidad y domicilio del responsable (razón social + domicilio fiscal reales).
- [ ] Datos personales recabados enumerados; declarar si hay datos sensibles (no debería haberlos en este flujo).
- [ ] Finalidades **primarias** (procesar cotización/pedido, cuenta, atención) separadas de **secundarias** (marketing/boletín), con mecanismo para que el titular niegue las secundarias.
- [ ] Transferencias a terceros (si aplica: proveedor de hosting, mensajería, etc.) y base de consentimiento.
- [ ] Procedimiento ARCO concreto: a qué correo/medio, qué debe incluir la solicitud, plazo de respuesta.
- [ ] Mecanismo de revocación del consentimiento.
- [ ] Cláusula de uso de cookies con enlace a la Política de Cookies.
- [ ] Cláusula de cambios al aviso + **fecha de última actualización**.
- [ ] Datos de contacto del área de datos personales.

### B. Política de Cookies (página nueva)

- [ ] Ruta nueva bajo `(main)` (ej. `src/app/(main)/cookies-policy/page.jsx`), consistente con el layout de privacidad/términos.
- [ ] Explica qué son las cookies, tipos usados (esenciales, analíticas, de preferencia, marketing), finalidad y duración.
- [ ] Cómo el usuario puede configurarlas/deshabilitarlas (incl. desde el banner y desde el navegador).

### C. Banner de consentimiento de cookies

- [ ] Banner al primer ingreso con acciones **Aceptar todas / Rechazar no esenciales / Configurar**.
- [ ] "Configurar" permite activar/desactivar por categoría (esenciales siempre on, no togglable).
- [ ] La preferencia **persiste** (localStorage/cookie propia) y no vuelve a mostrarse hasta que expire o el usuario la cambie.
- [ ] Las cookies/scripts **no esenciales NO se cargan** hasta que haya consentimiento explícito.
- [ ] Enlace a la Política de Cookies y al Aviso de Privacidad desde el banner.
- [ ] Accesible (focus trap correcto, navegable por teclado, no bloquea lectores de pantalla).

### D. Enlaces

- [ ] Footer (`src/components/Footer.js`) enlaza **Aviso de Privacidad** y **Política de Cookies**.
- [ ] Términos y Condiciones referencia y enlaza el Aviso de Privacidad.

## Definition of Done

- [ ] Textos legales revisados por el negocio (ver gates en Notes) antes de publicar.
- [ ] Rutas nuevas renderizan y enlazan correctamente; `tsc --noEmit` limpio.
- [ ] Banner verificado en desktop + móvil; la preferencia persiste tras recargar; cookies no esenciales bloqueadas sin consentimiento.
- [ ] Sin regresiones en el layout `(main)`.

## Notes

**Gated en input legal del negocio (no inventar):**

- Razón social, RFC, domicilio fiscal.
- Persona/departamento responsable de datos personales + su correo.
- Confirmar qué terceros reciben datos (hosting/Vercel, mensajería, analytics si se usa).

**Dependencias técnicas actuales:**

- ✅ **Resuelto (verificado 2026-08-06):** el email de contacto ya es el real de Toluca, `ferretera.toluca10@gmail.com`, tanto en `src/constants/businessInfo.js` (`email` y `dataContactEmail`) como en el footer. Es el que se usa para ejercer ARCO. El rebrand quedó completo: `grep -rni texcoco src/` no devuelve nada.
- Precedentes de patrón en el repo: páginas legales existentes (`privacy-statement`, `terms-conditions`) usan `Box maxWidth 1000 + Typography`; el banner puede usar MUI `Snackbar`/`Dialog` + `notistack` no aplica (es consentimiento persistente, no toast).
- Analytics: si se agrega Google Analytics u otro, el banner DEBE bloquearlo hasta consentimiento (categoría analíticas).

**No incluye:** la reescritura de Términos y Condiciones (ticket hermano — el T&C actual tampoco cubre el modelo de cotización ni mínimos PROFECO/LFPC).
