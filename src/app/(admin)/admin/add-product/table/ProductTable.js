import React from "react";
import { Add } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";
import { DataGrid, GridRowModes, GridToolbarContainer } from "@mui/x-data-grid";
import { v4 as uuidv4 } from "uuid";
import { getAddProductColumns } from "./columns";
import { isRowValid } from "../helpers";
import { localeText } from "../../../../../constants/x-datagrid/localeText";

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
          Agregar otra fila
        </Button>
        <Typography variant="caption" sx={{ pr: 2, color: "white !important" }}>
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
        localeText={localeText}
        rows={rows}
        columns={getAddProductColumns(
          handleDeleteClick,
          measures,
          productModels,
          setRows
        )}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        processRowUpdate={processRowUpdate}
        slots={{
          toolbar: EditToolbar,
        }}
        slotProps={{
          toolbar: { rows, setRows, setRowModesModel },
        }}
        sx={{
          gap: 1,
          "& .row-valid": {
            borderLeft: "4px solid #4caf50",
            backgroundColor: "#f1fff3",
          },
        }}
        density="compact"
        getRowClassName={(params) => {
          return isRowValid(params.row) ? "row-valid" : "";
        }}
        hideFooterPagination
      />
    </Box>
  );
};
