import { Box, Stack } from "@mui/material";
import {
  GridToolbarColumnsButton,
  GridToolbarExport,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";
import useResponsive from "../../hooks/use-responsive";

export const CustomToolbar = () => {
  const isMobile = useResponsive("down", "sm");

  return (
    <Box
      p={1}
      sx={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row", 
        gap: 1,
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "white",
        borderBottom: "1px solid #ddd",
      }}
    >
      {!isMobile && (
        <Stack direction="row" spacing={1}>
          <GridToolbarColumnsButton
            slotProps={{
              button: {
                size: "large",
              },
            }}
          />
          <GridToolbarExport
            printOptions={undefined}
            csvOptions={{ fileName: "productos", delimiter: ";" }}
          />
        </Stack>
      )}
      <GridToolbarQuickFilter
        debounceMs={500}
        placeholder="Buscar productos..."
        sx={{
          width: isMobile ? "100%" : 250, // 👈 full width en mobile
          "& .MuiInputBase-root": {
            fontSize: "0.875rem",
            padding: "4px 8px",
          },
        }}
      />
    </Box>
  );
};
