import React from "react";
import { Add } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";
import { DataGrid, GridRowModes, GridToolbarContainer } from "@mui/x-data-grid";
import { v4 as uuidv4 } from "uuid";
import { getAddProductColumns } from "./columns";

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
        // size: "",
        modelId: null,
        modelName: "",
        measureId: null,
        measureValue: "",
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
      <Box
        sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}
        alignItems="center"
      >
        <Button
          startIcon={<Add />}
          size="small"
          onClick={handleClick}
          color="primary"
          variant="text"
        >
          Agregar otra fila
        </Button>
        <Typography variant="caption" color="text.secondary" sx={{ pr: 2 }}>
          Presiona <strong>Enter</strong> para guardar la fila actual.
        </Typography>
      </Box>
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
  measures,
  productModels,
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
        columns={getAddProductColumns(
          handleDeleteClick,
          measures,
          productModels,
          setRows
        )}
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
        density="compact"
      />
    </Box>
  );
};
