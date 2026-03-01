/**
 * Configuración de revalidación ISR para Next.js App Router.
 *
 * Se usan con `export const revalidate = ...` en page.js / layout.js.
 * Revalidación on-demand: las páginas son estáticas hasta que el admin
 * ejecuta una server action que llama `revalidatePath()`.
 */
export const revalidateTimes = {
  /** false = nunca revalidar automáticamente (on-demand via server actions) */
  DEFAULT: false,
};
