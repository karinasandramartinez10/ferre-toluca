import type { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { toCapitalizeWords } from "../../../../utils/cases";
import type { Subcategory } from "../../../../types/catalog";

export const subcategoriesColumns: GridColDef[] = [
  {
    field: "name",
    headerName: "Nombre",
    flex: 1,
    valueGetter: (_: unknown, row: { name?: string }) =>
      row?.name ? toCapitalizeWords(row.name) : "",
  },
  {
    field: "category",
    headerName: "Categoría Asociada",
    renderCell: (params: GridRenderCellParams<Subcategory>) =>
      params.row.category?.name ? toCapitalizeWords(params.row.category.name) : "Sin categoría",
    flex: 1,
  },
];
