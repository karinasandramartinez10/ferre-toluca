export const validateRows = (rows) => {
  for (let row of rows) {
    if (!row.name || !row.code || !row.description) {
      return false;
    }
  }
  return true;
};
