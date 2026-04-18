import type { GridColDef } from "@mui/x-data-grid";
import { toCapitalizeWords } from "../../../../utils/cases";

export const categoriesColumns: GridColDef[] = [
  {
    field: "name",
    headerName: "Nombre",
    flex: 1,
    valueGetter: (_: unknown, row: { name?: string }) =>
      row?.name ? toCapitalizeWords(row.name) : "",
  },
];
