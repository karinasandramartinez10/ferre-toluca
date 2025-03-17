import { Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { getBrandsColumns } from "./columns";

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
        columns={getBrandsColumns(onEditClick)}
        pageSize={10}
        rowsPerPageOptions={[10]}
        disableRowSelectionOnClick
        sx={{ gap: 1 }}
      />
    </Box>
  );
};

export default BrandsTable;
