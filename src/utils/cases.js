export function toCapitalizeFirstLetter(str) {
  if (typeof str !== "string" || str.length === 0) {
    return "String no válido";
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function toCapitalizeWords(str) {
  if (typeof str !== "string" || str.length === 0) {
    return "String no válido";
  }
  return str.split(" ").map(toCapitalizeFirstLetter).join(" ");
}
