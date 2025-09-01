import { toCapitalizeWords } from "../../../../utils/cases";

export const subcategoriesColumns = [
  {
    field: "name",
    headerName: "Nombre",
    flex: 1,
    valueGetter: (_, row) => (row?.name ? toCapitalizeWords(row?.name) : ""),
  },
  {
    field: "category",
    headerName: "Categoría Asociada",
    renderCell: (params) =>
      params.row.category?.name
        ? toCapitalizeWords(params.row.category?.name)
        : "Sin categoría",
    flex: 1,
  },
];
