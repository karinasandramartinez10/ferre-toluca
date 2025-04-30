import { Box } from "@mui/material";
import Image from "next/image";

export const brandsColumns = [
  {
    field: "imageUrl",
    headerName: "Logo",
    flex: 0.2,
    renderCell: (params) => (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        width="100%"
        height="100%"
      >
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
  { field: "name", headerName: "Nombre", flex: 1 },
];
