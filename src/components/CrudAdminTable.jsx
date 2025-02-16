import { Edit } from "@mui/icons-material";
import { Box } from "@mui/material";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";

const CrudAdminTable = ({ rows, columns = [], onEditClick }) => {
  const dynamicColumns = [
    ...columns,
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
  ];

  return (
    <Box
      sx={{
        height: 700,
        width: "100%",
      }}
    >
      <DataGrid
        rows={rows}
        columns={dynamicColumns}
        pageSize={10}
        rowsPerPageOptions={[10]}
        disableRowSelectionOnClick
        sx={{ gap: 1 }}
      />
    </Box>
  );
};

export default CrudAdminTable;
