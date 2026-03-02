import type { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import Image from "next/image";
import { toCapitalizeWords } from "../../../../utils/cases";
import type { Brand } from "../../../../types/catalog";

export const brandsColumns: GridColDef[] = [
  {
    field: "imageUrl",
    headerName: "Logo",
    flex: 0.2,
    renderCell: (params: GridRenderCellParams<Brand>) => (
      <Box display="flex" alignItems="center" justifyContent="center" width="100%" height="100%">
        <Image
          src={params.row.File?.path || "/images/placeholder.png"}
          alt={params.row.name}
          width={40}
          height={40}
          style={{ borderRadius: 4 }}
        />
      </Box>
    ),
  },
  {
    field: "name",
    headerName: "Nombre",
    flex: 1,
    valueGetter: (_: unknown, row: { name?: string }) =>
      row?.name ? toCapitalizeWords(row.name) : "",
  },
];
