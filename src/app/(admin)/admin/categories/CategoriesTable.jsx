import { Delete, Edit } from "@mui/icons-material";
import { Box } from "@mui/material";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";

const CategoriesTable = ({ rows, onEditClick, onDeleteClick }) => {
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
                <GridActionsCellItem
                  key={`delete-${row.id}`}
                  icon={<Delete />}
                  label="Delete"
                  onClick={() => onDeleteClick(row)}
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

export default CategoriesTable;
