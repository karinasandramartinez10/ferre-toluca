import { Add, Edit, FolderOutlined } from "@mui/icons-material";
import { Box, Button, Tooltip, Typography } from "@mui/material";
import { DataGrid, GridActionsCellItem, GridToolbarContainer } from "@mui/x-data-grid";
import type {
  GridColDef,
  GridPaginationModel,
  GridRowParams,
  GridRenderCellParams,
} from "@mui/x-data-grid";
import { localeText } from "../constants/x-datagrid/localeText";

interface CrudToolbarProps {
  title: string;
  handleClick: () => void;
  addLabel?: string;
  scopeLabel?: string;
}

function CrudToolbar({ title, handleClick, addLabel, scopeLabel }: CrudToolbarProps) {
  return (
    <GridToolbarContainer sx={{ backgroundColor: "primary.light", px: 1.5 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          gap: 1,
        }}
      >
        {scopeLabel ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 0 }}>
            <FolderOutlined sx={{ fontSize: 16, color: "white !important", flexShrink: 0 }} />
            <Typography
              fontWeight={600}
              color="white"
              fontSize="14px"
              sx={{
                color: "white !important",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {scopeLabel}
            </Typography>
          </Box>
        ) : (
          <Box />
        )}

        <Button
          startIcon={<Add sx={{ color: "white !important" }} />}
          size="small"
          onClick={handleClick}
          color="primary"
          variant="text"
          sx={{
            color: "white !important",
            flexShrink: 0,
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.22)",
              borderRadius: 1,
            },
          }}
        >
          {addLabel || `Agregar otra ${title}`}
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
  onDrillClick?: (row: Row) => void;
  drillLabel?: string;
  addLabel?: string;
  scopeLabel?: string;
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
  onDrillClick,
  drillLabel = "Ver",
  addLabel,
  scopeLabel,
}: CrudAdminTableProps) => {
  // En modo drill, el ícono de carpeta se integra a la primera columna (el nombre),
  // centrado junto al texto, en vez de columnas sueltas con headers vacíos.
  const decoratedColumns: GridColDef[] =
    onDrillClick && columns.length
      ? [
          {
            ...columns[0],
            renderCell: (params: GridRenderCellParams) => (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, width: "100%" }}>
                <Tooltip title={drillLabel}>
                  <FolderOutlined sx={{ color: "secondary.main", fontSize: 18, flexShrink: 0 }} />
                </Tooltip>
                <Box
                  component="span"
                  sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                >
                  {columns[0].renderCell ? columns[0].renderCell(params) : params.value}
                </Box>
              </Box>
            ),
          },
          ...columns.slice(1),
        ]
      : columns;

  const dynamicColumns: GridColDef[] = [
    ...decoratedColumns,
    {
      field: "actions",
      type: "actions",
      headerName: "Editar",
      flex: 0.3,
      getActions: ({ row }: GridRowParams) => [
        <GridActionsCellItem
          key={`edit-${row.id}`}
          icon={<Edit />}
          label="Editar"
          onClick={(e) => {
            e.stopPropagation();
            onEditClick(row);
          }}
          color="inherit"
        />,
      ],
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
        onRowClick={onDrillClick ? (params) => onDrillClick(params.row) : undefined}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
        sx={{
          gap: 1,
          ...(onDrillClick && {
            "& .MuiDataGrid-row": { cursor: "pointer" },
            "& .MuiDataGrid-row:hover": { bgcolor: "action.hover" },
          }),
        }}
        slots={{
          toolbar: CrudToolbar as any,
        }}
        slotProps={{
          toolbar: {
            title,
            handleClick,
            addLabel,
            scopeLabel,
          } as any,
        }}
      />
    </Box>
  );
};

export default CrudAdminTable;
