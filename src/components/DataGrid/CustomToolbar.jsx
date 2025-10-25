import { Box, IconButton, Stack } from "@mui/material";
import {
  GridToolbarColumnsButton,
  GridToolbarQuickFilter,
  GridToolbarExportContainer,
  GridCsvExportMenuItem,
} from "@mui/x-data-grid";
import useResponsive from "../../hooks/use-responsive";
import { Print } from "@mui/icons-material";

export const CustomToolbar = ({ onPrint }) => {
  const isMobile = useResponsive("down", "sm");

  return (
    <Box
      p={1}
      sx={{
        display: "flex",
        gap: 2,
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "white",
        borderBottom: "1px solid #ddd",
      }}
    >
      {!isMobile && (
        <Stack direction="row" spacing={1} sx={{ flexShrink: 0 }}>
          <GridToolbarColumnsButton
            slotProps={{
              button: {
                size: "large",
              },
            }}
          />
          <GridToolbarExportContainer>
            <GridCsvExportMenuItem
              options={{ fileName: "productos", delimiter: ";" }}
            />
          </GridToolbarExportContainer>
        </Stack>
      )}
      <GridToolbarQuickFilter
        debounceMs={500}
        placeholder="Buscar productos..."
        sx={{
          flexGrow: 1,
          minWidth: isMobile ? "100%" : 240,
          maxWidth: isMobile ? "100%" : 560,
          "& .MuiInputBase-root": {
            fontSize: "0.875rem",
            padding: "4px 8px",
          },
        }}
      />
      <IconButton onClick={onPrint} sx={{ flexShrink: 0 }}>
        <Print color="primary" />
      </IconButton>
    </Box>
  );
};
