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
      px={1.5}
      py={0.75}
      sx={{
        display: "flex",
        gap: 1.5,
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "white",
        borderBottom: "1px solid #eee",
      }}
    >
      {!isMobile && (
        <Stack direction="row" spacing={0.5} sx={{ flexShrink: 0 }}>
          <GridToolbarColumnsButton
            slotProps={{
              button: {
                size: "small",
                variant: "text",
                sx: { fontSize: "0.75rem", textTransform: "none", color: "text.secondary" },
              },
            }}
          />
          <GridToolbarExportContainer
            slotProps={{
              button: {
                size: "small",
                variant: "text",
                sx: { fontSize: "0.75rem", textTransform: "none", color: "text.secondary" },
              },
            }}
          >
            <GridCsvExportMenuItem
              options={{ fileName: "productos", delimiter: ";" }}
              sx={{ fontSize: "0.8rem", minHeight: 32, py: 0.5 }}
            />
          </GridToolbarExportContainer>
        </Stack>
      )}
      <GridToolbarQuickFilter
        debounceMs={500}
        placeholder="Buscar..."
        sx={{
          flexGrow: 1,
          minWidth: isMobile ? "100%" : 200,
          maxWidth: isMobile ? "100%" : 400,
          "& .MuiInputBase-root": {
            fontSize: "0.8rem",
            padding: "2px 8px",
          },
        }}
      />
      {onPrint && (
        <IconButton size="small" onClick={onPrint} sx={{ flexShrink: 0 }}>
          <Print fontSize="small" color="action" />
        </IconButton>
      )}
    </Box>
  );
};
