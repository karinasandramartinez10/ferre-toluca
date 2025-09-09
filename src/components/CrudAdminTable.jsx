import { Add, Edit } from "@mui/icons-material";
import { Box, Button } from "@mui/material";
import {
  DataGrid,
  GridActionsCellItem,
  GridToolbarContainer,
} from "@mui/x-data-grid";
import { localeText } from "../constants/x-datagrid/localeText";

function CrudToolbar({ title, handleClick }) {
  return (
    <GridToolbarContainer
      sx={{
        backgroundColor: "primary.light",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
        }}
        alignItems="center"
      >
        <Button
          startIcon={<Add sx={{ color: "white !important" }} />}
          size="small"
          onClick={handleClick}
          color="primary"
          variant="text"
          sx={{
            color: "white !important",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.22)",
              borderRadius: 1,
            },
          }}
        >
          Agregar otra {title}
        </Button>
      </Box>
    </GridToolbarContainer>
  );
}

const CrudAdminTable = ({
  rows,
  columns = [],
  onEditClick,
  paginationModel,
  onPaginationModelChange,
  rowCount,
  title,
  handleClick,
}) => {
  const dynamicColumns = [
    ...columns,
    {
      field: "actions",
      type: "actions",
      headerName: "Acciones",
      flex: 0.3,
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
        height: 900,
        width: "100%",
      }}
    >
      <DataGrid
        localeText={localeText}
        rows={rows}
        columns={dynamicColumns}
        pagination
        paginationModel={paginationModel}
        onPaginationModelChange={onPaginationModelChange}
        rowCount={rowCount}
        pageSizeOptions={[10, 25, 50]}
        paginationMode="server"
        disableRowSelectionOnClick
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
        sx={{ gap: 1 }}
        slots={{
          toolbar: CrudToolbar,
        }}
        slotProps={{
          toolbar: {
            title,
            handleClick,
          },
        }}
      />
    </Box>
  );
};

export default CrudAdminTable;
