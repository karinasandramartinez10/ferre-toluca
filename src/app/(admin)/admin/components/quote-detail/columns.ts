import type { GridColDef } from "@mui/x-data-grid";

export const statusLogColumns: GridColDef[] = [
  { field: "admin", headerName: "Admin", flex: 1 },
  { field: "change", headerName: "Cambio de estado", flex: 2 },
  { field: "date", headerName: "Fecha", flex: 1 },
];
