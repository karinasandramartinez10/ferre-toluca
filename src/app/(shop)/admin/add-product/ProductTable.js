import { Add, Delete } from "@mui/icons-material";
import { Box, Button, IconButton } from "@mui/material";
import {
  DataGrid,
  GridActionsCellItem,
  GridRowModes,
  GridToolbarContainer,
} from "@mui/x-data-grid";
import { v4 as uuidv4 } from "uuid";

function EditToolbar({ rows, setRows, setRowModesModel }) {
  const handleClick = () => {
    const newName = rows[0]?.name || "";
    const id = uuidv4();
    setRows((oldRows) => [
      ...oldRows,
      {
        id,
        name: newName,
        description: "",
        code: "",
        specifications: "",
        color: "",
        size: "",
        isNew: true,
      },
    ]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: "name" },
    }));
  };

  return (
    <GridToolbarContainer>
      <IconButton
        size="small"
        edge="start"
        aria-label="menu"
        onClick={handleClick}
        color="primary"
      >
        <Add />
      </IconButton>
    </GridToolbarContainer>
  );
}

export const ProductTable = ({
  rows,
  setRows,
  rowModesModel,
  setRowModesModel,
  handleDeleteClick,
  processRowUpdate,
  handleRowModesModelChange,
}) => {
  return (
    <Box
      sx={{
        height: 500,
        width: "100%",
      }}
    >
      <DataGrid
        rows={rows}
        columns={[
          { field: "name", headerName: "Nombre", width: 150, editable: true },
          { field: "code", headerName: "Código", width: 100, editable: true },
          {
            field: "description",
            headerName: "Descripción",
            width: 150,
            editable: true,
          },
          { field: "color", headerName: "Color", width: 150, editable: true },
          { field: "size", headerName: "Tamaño", width: 150, editable: true },
          {
            field: "specifications",
            headerName: "Características",
            width: 150,
            editable: true,
          },
          {
            field: "actions",
            type: "actions",
            headerName: "Acciones",
            cellClassName: "actions",
            getActions: ({ id }) => {
              return [
                <GridActionsCellItem
                  icon={<Delete />}
                  label="Delete"
                  onClick={handleDeleteClick(id)}
                  color="inherit"
                />,
              ];
            },
          },
        ]}
        editMode="row"
        // pageSize={5}
        // rowsPerPageOptions={[5]}
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        processRowUpdate={processRowUpdate}
        slots={{
          toolbar: EditToolbar,
        }}
        slotProps={{
          toolbar: { rows, setRows, setRowModesModel },
        }}
        sx={{ gap: 1 }}
      />
    </Box>
  );
};
