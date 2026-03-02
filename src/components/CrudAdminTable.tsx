import { Add, Edit } from "@mui/icons-material";
import { Box, Button } from "@mui/material";
import { DataGrid, GridActionsCellItem, GridToolbarContainer } from "@mui/x-data-grid";
import type { GridColDef, GridPaginationModel, GridRowParams } from "@mui/x-data-grid";
import { localeText } from "../constants/x-datagrid/localeText";

interface CrudToolbarProps {
  title: string;
  handleClick: () => void;
}

function CrudToolbar({ title, handleClick }: CrudToolbarProps) {
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

type Row = any;

interface CrudAdminTableProps {
  rows: Row[];
  columns?: GridColDef[];
  onEditClick: (row: Row) => void;
  paginationModel: GridPaginationModel;
  onPaginationModelChange: (model: GridPaginationModel) => void;
  rowCount: number;
  title: string;
  handleClick: () => void;
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
}: CrudAdminTableProps) => {
  const dynamicColumns: GridColDef[] = [
    ...columns,
    {
      field: "actions",
      type: "actions",
      headerName: "Acciones",
      flex: 0.3,
      getActions: ({ row }: GridRowParams) => {
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
          toolbar: CrudToolbar as any,
        }}
        slotProps={{
          toolbar: {
            title,
            handleClick,
          } as any,
        }}
      />
    </Box>
  );
};

export default CrudAdminTable;
