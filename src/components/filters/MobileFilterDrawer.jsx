"use client";

import {
  Drawer,
  Box,
  IconButton,
  Typography,
  Button,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FilterSidebar from "./FilterSidebar";

/**
 * Drawer de filtros para dispositivos móviles.
 *
 * @param {Object} props
 * @param {boolean} props.open - Estado de apertura.
 * @param {Function} props.onClose - Callback para cerrar.
 * @param {Object} props.options - Opciones de filtros.
 * @param {Object} props.selectedFilters - Filtros seleccionados.
 * @param {Object} props.fixedFilters - Filtros fijos.
 * @param {Function} props.onToggle - Callback para toggle.
 * @param {Function} props.onClear - Callback para limpiar.
 * @param {boolean} props.hasActiveFilters - Si hay filtros activos.
 * @param {boolean} props.loading - Estado de carga.
 * @param {number} props.resultsCount - Cantidad de resultados.
 */
const MobileFilterDrawer = ({
  open,
  onClose,
  options,
  selectedFilters,
  fixedFilters,
  onToggle,
  onClear,
  hasActiveFilters,
  loading,
  resultsCount = 0,
}) => {
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: "100%",
          maxWidth: 360,
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 2,
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Typography variant="h6" fontWeight={700}>
          Filtros
        </Typography>
        <IconButton onClick={onClose} edge="end">
          <CloseIcon />
        </IconButton>
      </Box>

      <Box sx={{ p: 2, flex: 1, overflowY: "auto" }}>
        <FilterSidebar
          options={options}
          selectedFilters={selectedFilters}
          fixedFilters={fixedFilters}
          onToggle={onToggle}
          onClear={onClear}
          hasActiveFilters={hasActiveFilters}
          loading={loading}
        />
      </Box>

      <Box
        sx={{
          p: 2,
          borderTop: 1,
          borderColor: "divider",
          backgroundColor: "background.paper",
        }}
      >
        <Button
          variant="contained"
          fullWidth
          onClick={onClose}
          size="large"
        >
          Ver {resultsCount} productos
        </Button>
      </Box>
    </Drawer>
  );
};

export default MobileFilterDrawer;
