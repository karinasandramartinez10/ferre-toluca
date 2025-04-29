import { Box } from "@mui/material";
import { GridFooterContainer, GridPagination } from "@mui/x-data-grid";

export const CustomFooter = () => {
  return (
    <GridFooterContainer
      sx={{
        backgroundColor: "white",
        borderTop: "1px solid #ddd",
        justifyContent: "center",
        paddingY: 1,
        fontSize: "0.875rem",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <GridPagination />
      </Box>
    </GridFooterContainer>
  );
};
