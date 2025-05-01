export const validateRows = (rows) => {
  for (let row of rows) {
    if (
      !row.name ||
      !row.code ||
      !row.description ||
      !row.measureValue ||
      !row.measureId
    ) {
      return false;
    }
  }
  return true;
};

export const isRowValid = (row) => {
  return (
    row.name &&
    row.code &&
    row.description &&
    row.measureValue &&
    row.measureId
  );
};