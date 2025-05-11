import { v4 as uuidv4 } from "uuid";

export const useCSVParser = () => {
  const transformCSVToRows = (csvData, measures = []) => {
    const errors = [];
    const validAbbrs = measures.map((m) => m.abbreviation.toLowerCase());

    const resolveMeasureId = (abbr, index) => {
      if (!abbr) return null;
      const match = measures.find(
        (m) => m.abbreviation.toLowerCase() === abbr.trim().toLowerCase()
      );
      if (!match) {
        errors.push({
          index,
          value: abbr,
        });
        return null;
      }
      return match.id;
    };

    const parsedRows = csvData.map((row, index) => ({
      id: uuidv4(),
      name: row["Nombre"] || "",
      code: row["Código"] || "",
      description: row["Descripción"] || "",
      specifications: row["Características"] || "",
      measureValue: row["Valor"] || "",
      measureId: resolveMeasureId(row["Unidad"], index),
      modelName: row["Modelo"] || "",
      color: row["Color"] || "",
      isNew: true,
    }));

    return {
      rows: parsedRows,
      errors,
      acceptedAbbreviations: validAbbrs,
    };
  };

  return { transformCSVToRows };
};
