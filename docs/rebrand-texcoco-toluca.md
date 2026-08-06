# Rebrand: Texcoco → Toluca

El fork de Toluca se clonó de Texcoco pero nunca se debrandó. El primer deploy a Vercel (2026-04-21, cuenta "Karina's projects") salió con branding de Texcoco.

**Bloqueante para DNS cutover de `ferreteratoluca.com`:** si apuntamos el dominio antes de limpiar esto, los visitantes van a ver "Ferretería Texcoco".

---

## ✅ ESTADO (2026-07-20) — rebrand de texto/contacto HECHO

- **Nombre:** todas las refs → **"Ferretera Toluca"** (sin í, alineado al dominio `ferreteratoluca.com`
  y al correo). Cubre metadata (title/description), footer, copyright, páginas legales, alt text.
- **Email:** ✅ **`ferretera.toluca10@gmail.com`** (cuenta real de Toluca) en footer + páginas legales.
- **Teléfono:** ✅ **+52 720 788 8704** en footer.
- **Favicon:** `iso_texcoco.svg` → **`iso_toluca.svg`**.
- **Logos wordmark:** reemplazados por **wordmarks de texto INTERIM** (`tolucawhite.svg` header blanco
  - `toluca_logo2.svg` versión roja). Los viejos SVG de Texcoco se borraron.
- **Verificación:** `grep -rni texcoco` en el repo = 0. `tsc` limpio.

### ⚠️ Único blocker restante antes del cutover de DNS

1. **Logos reales de Ferretera Toluca** — hoy son placeholders de texto. Reemplazar
   `public/images/tolucawhite.svg` y `public/images/toluca_logo2.svg` (viewBox `0 0 200 100`)
   cuando haya diseño real. (En el checklist de la dueña → sección Bonus.)

Cuando lleguen los logos: reemplazar los 2 SVG (mismos nombres de archivo → sin cambios de código),
verificar en preview de Vercel, agregar dominio `ferreteratoluca.com` en Vercel + DNS en name.com.
