import { toCapitalizeWords } from "../../../../utils/cases";

export const categoriesColumns = [
  {
    field: "name",
    headerName: "Nombre",
    flex: 1,
    valueGetter: (_, row) => (row?.name ? toCapitalizeWords(row?.name) : ""),
  },
];
