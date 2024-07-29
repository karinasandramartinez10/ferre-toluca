export const validateRows = (rows) => {
  for (let row of rows) {
    if (!row.name || !row.description || !row.code || !row.specifications) {
      return false;
    }
  }
  return true;
};
