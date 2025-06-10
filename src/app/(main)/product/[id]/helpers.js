import { COLOR_HEX } from "./constants";

// Compilamos un regex de todos los colores base, con \b para palabra completa, case‐insensitive
const COLOR_REGEX = new RegExp(
  `\\b(${Object.keys(COLOR_HEX).join("|")})\\b`,
  "i"
);

/**
 * Extrae la primera coincidencia con un color base en el label.
 * Si no hay match, devuelve 'gris' (fallback).
 */
export function getBaseColorLabel(label = "") {
  const m = COLOR_REGEX.exec(label);
  return m ? m[1].toLowerCase() : "gris";
}

/**
 * Dado un label completo, resuelve su color hex de tu mapa.
 */
export function resolveColorHex(label = "") {
  const key = getBaseColorLabel(label);
  return COLOR_HEX[key] || COLOR_HEX.gris;
}

/**
 * Blanco solo sobre fondo blanco; para cualquier otro color devolvemos texto blanco.
 */
export function getContrastColor(hex = "#ffffff") {
  return hex.trim().toLowerCase() === COLOR_HEX.blanco ? "#000000" : "#ffffff";
}
