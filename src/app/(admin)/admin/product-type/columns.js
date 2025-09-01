import { toCapitalizeWords } from "../../../../utils/cases";

export const productTypesColumns = [
  {
    field: "name",
    headerName: "Nombre",
    flex: 1,
    valueGetter: (_, row) => (row?.name ? toCapitalizeWords(row?.name) : ""),
  },
  {
    field: "subcategory",
    headerName: "Subcategoría Asociada",
    renderCell: (params) =>
      params.row.subCategory?.name
        ? toCapitalizeWords(params.row.subCategory?.name)
        : "Sin subcategoría",
    flex: 1,
  },
];
