"use client";

import {
  Box,
  Typography,
  Button,
  Divider,
  Skeleton,
  Stack,
} from "@mui/material";
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";
import FilterSection from "./FilterSection";

/**
 * Sidebar de filtros para productos.
 *
 * @param {Object} props
 * @param {Object} props.options - Opciones de filtros desde useFilterOptions.
 * @param {Object} props.selectedFilters - Filtros seleccionados (urlFilters).
 * @param {Object} props.fixedFilters - Filtros fijos del contexto.
 * @param {Function} props.onToggle - Callback para toggle de filtro.
 * @param {Function} props.onClear - Callback para limpiar filtros.
 * @param {boolean} props.hasActiveFilters - Si hay filtros activos.
 * @param {boolean} props.loading - Estado de carga.
 */
const FilterSidebar = ({
  options = {},
  selectedFilters = {},
  fixedFilters = {},
  onToggle,
  onClear,
  hasActiveFilters,
  loading = false,
}) => {
  // Determinar qué filtros mostrar basado en los filtros fijos
  const showBrands = !fixedFilters.brandIds?.length;
  const showCategories = !fixedFilters.categoryIds?.length;
  const showSubcategories = !fixedFilters.subcategoryIds?.length;
  const showTypes = !fixedFilters.typeIds?.length;
  const showModels = true;
  const showMeasures = true;
  const showDesigns = true;

  if (loading) {
    return (
      <Box>
        <Skeleton variant="text" width={100} height={32} sx={{ mb: 2 }} />
        {[1, 2, 3, 4].map((i) => (
          <Box key={i} sx={{ mb: 2 }}>
            <Skeleton variant="text" width={80} height={24} />
            <Stack spacing={0.5} sx={{ mt: 1 }}>
              {[1, 2, 3].map((j) => (
                <Skeleton key={j} variant="text" width="100%" height={24} />
              ))}
            </Stack>
          </Box>
        ))}
      </Box>
    );
  }

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 1,
        }}
      >
        <Typography variant="body1" fontWeight={700}>
          Filtros
        </Typography>
        {hasActiveFilters && (
          <Button
            size="small"
            startIcon={<FilterAltOffIcon />}
            onClick={onClear}
            sx={{ textTransform: "none" }}
          >
            Limpiar
          </Button>
        )}
      </Box>

      <Divider sx={{ mb: 1 }} />

      {showBrands && options.brands?.length > 0 && (
        <FilterSection
          title="Marca"
          options={options.brands}
          selectedIds={selectedFilters.brandIds || []}
          onToggle={(id) => onToggle("brandIds", id)}
          showSearch={options.brands.length > 5}
          defaultExpanded
        />
      )}

      {showCategories && options.categories?.length > 0 && (
        <FilterSection
          title="Categoría"
          options={options.categories}
          selectedIds={selectedFilters.categoryIds || []}
          onToggle={(id) => onToggle("categoryIds", id)}
          showSearch={options.categories.length > 5}
          defaultExpanded
        />
      )}

      {showSubcategories && options.subcategories?.length > 0 && (
        <FilterSection
          title="Subcategoría"
          options={options.subcategories}
          selectedIds={selectedFilters.subcategoryIds || []}
          onToggle={(id) => onToggle("subcategoryIds", id)}
          showSearch={options.subcategories.length > 5}
          defaultExpanded={false}
        />
      )}

      {showTypes && options.types?.length > 0 && (
        <FilterSection
          title="Tipo"
          options={options.types}
          selectedIds={selectedFilters.typeIds || []}
          onToggle={(id) => onToggle("typeIds", id)}
          showSearch={options.types.length > 5}
          defaultExpanded={false}
        />
      )}

      {showModels && options.models?.length > 0 && (
        <FilterSection
          title="Modelo"
          options={options.models}
          selectedIds={selectedFilters.modelIds || []}
          onToggle={(id) => onToggle("modelIds", id)}
          showSearch={options.models.length > 5}
          defaultExpanded={false}
        />
      )}

      {showMeasures && options.measures?.length > 0 && (
        <FilterSection
          title="Medida"
          options={options.measures.map((m) => ({
            ...m,
            name: m.name || m.abbreviation,
          }))}
          selectedIds={selectedFilters.measureIds || []}
          onToggle={(id) => onToggle("measureIds", id)}
          defaultExpanded={false}
        />
      )}

      {showDesigns && options.designs?.length > 0 && (
        <FilterSection
          title="Diseño"
          options={options.designs}
          selectedIds={selectedFilters.designIds || []}
          onToggle={(id) => onToggle("designIds", id)}
          defaultExpanded={false}
        />
      )}
    </Box>
  );
};

export default FilterSidebar;
