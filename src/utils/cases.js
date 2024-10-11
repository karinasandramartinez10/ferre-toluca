export function toCapitalizeFirstLetter(str) {
  return typeof str === "string" && str.length > 0
    ? str.charAt(0).toUpperCase() + str.slice(1)
    : "";
}
export function toCapitalizeWords(str) {
  if (typeof str !== "string" || str.length === 0) {
    return "String no válido";
  }
  return str.split(" ").map(toCapitalizeFirstLetter).join(" ");
}

export function transformCategoryPath(str) {
  if (typeof str !== "string" || str.length === 0) {
    return "";
  }

  const cleanedStr = str.replace(/[-,]/g, " ");

  return cleanedStr.split(" ").map(toCapitalizeFirstLetter).join(" ");
}
