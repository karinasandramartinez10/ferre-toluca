import { COLOR_HEX } from "./constants";

export function normalizeKey(str = "") {
  return str
    .normalize("NFD") // separa acentos
    .replace(/[\u0300-\u036f]/g, "") // quita las marcas diacríticas
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ""); // quita espacios/símbolos
}

const COLOR_ENTRIES = Object.entries(COLOR_HEX)
  .map(([key, hex]) => [normalizeKey(key), hex])
  .sort((a, b) => b[0].length - a[0].length);

// Dado un label completo, busca la primera clave del diccionario
// cuyo normalizeKey esté contenido en normalizeKey(label).
// Si no encuentra nada, retorna gris por defecto.
export function resolveColorHex(label = "") {
  const nl = normalizeKey(label);
  for (const [keyNorm, hex] of COLOR_ENTRIES) {
    if (nl.includes(keyNorm)) {
      return hex;
    }
  }
  return COLOR_HEX.gris;
}

// 4️Calcula un color de texto (blanco o negro) basándose en luminancia percibida.
export function getContrastColor(hex = "#ffffff") {
  const c = hex.charAt(0) === "#" ? hex.substring(1) : hex;
  const r = parseInt(c.substr(0, 2), 16);
  const g = parseInt(c.substr(2, 2), 16);
  const b = parseInt(c.substr(4, 2), 16);
  // fórmula aproximada de luminancia
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
  // umbral típico a 186
  return luminance > 186 ? "#000000" : "#ffffff";
}
