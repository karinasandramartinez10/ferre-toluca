import { Edit } from "@mui/icons-material";
import { Box } from "@mui/material";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import Image from "next/image";

const BrandsTable = ({ rows, onEditClick }) => {
  return (
    <Box
      sx={{
        height: 700,
        width: "100%",
      }}
    >
      <DataGrid
        rows={rows}
        columns={[
          {
            field: "imageUrl",
            headerName: "Imagen",
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
          {
            field: "actions",
            type: "actions",
            headerName: "Acciones",
            flex: 0.2,
            getActions: ({ row }) => {
              return [
                <GridActionsCellItem
                  key={`edit-${row.id}`}
                  icon={<Edit />}
                  label="Edit"
                  onClick={() => onEditClick(row)}
                  color="inherit"
                />,
              ];
            },
          },
        ]}
        pageSize={10}
        rowsPerPageOptions={[10]}
        disableRowSelectionOnClick
        sx={{ gap: 1 }}
      />
    </Box>
  );
};

export default BrandsTable;
