"use client";

import { useCallback, useMemo } from "react";
import { Box, Typography, Button, Divider, Skeleton, Stack } from "@mui/material";
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";
import FilterSection from "./FilterSection";
import type { FilterOptions, SelectedFilters } from "../../types/filters";

interface FilterSidebarProps {
  options?: FilterOptions;
  selectedFilters?: SelectedFilters;
  fixedFilters?: SelectedFilters;
  onToggle: (filterKey: string, id: number | string) => void;
  onClear: () => void;
  hasActiveFilters: boolean;
  loading?: boolean;
}

const FilterSidebar = ({
  options = {},
  selectedFilters = {},
  fixedFilters = {},
  onToggle,
  onClear,
  hasActiveFilters,
  loading = false,
}: FilterSidebarProps) => {
  const showBrands = !fixedFilters.brandIds?.length;
  const showCategories = !fixedFilters.categoryIds?.length;
  const showSubcategories = !fixedFilters.subcategoryIds?.length;
  const showTypes = !fixedFilters.typeIds?.length;

  const handleToggle = useCallback(
    (filterKey: string) => (id: number | string) => onToggle(filterKey, id),
    [onToggle]
  );

  const measureOptions = useMemo(
    () =>
      options.measures?.map((m) => ({
        ...m,
        name: m.name || m.abbreviation || "",
      })) ?? [],
    [options.measures]
  );

  const secondaryMeasureOptions = useMemo(
    () =>
      options.secondaryMeasures?.map((m) => ({
        ...m,
        name: m.name || m.abbreviation || "",
      })) ?? [],
    [options.secondaryMeasures]
  );

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

      {showBrands && (options.brands?.length ?? 0) > 0 && (
        <FilterSection
          title="Marca"
          options={options.brands}
          selectedIds={selectedFilters.brandIds || []}
          onToggle={handleToggle("brandIds")}
          showSearch={(options.brands?.length ?? 0) > 5}
          defaultExpanded
        />
      )}

      {showCategories && (options.categories?.length ?? 0) > 0 && (
        <FilterSection
          title="Categoría"
          options={options.categories}
          selectedIds={selectedFilters.categoryIds || []}
          onToggle={handleToggle("categoryIds")}
          showSearch={(options.categories?.length ?? 0) > 5}
          defaultExpanded
        />
      )}

      {showSubcategories && (options.subcategories?.length ?? 0) > 0 && (
        <FilterSection
          title="Subcategoría"
          options={options.subcategories}
          selectedIds={selectedFilters.subcategoryIds || []}
          onToggle={handleToggle("subcategoryIds")}
          showSearch={(options.subcategories?.length ?? 0) > 5}
          defaultExpanded={false}
        />
      )}

      {showTypes && (options.types?.length ?? 0) > 0 && (
        <FilterSection
          title="Tipo"
          options={options.types}
          selectedIds={selectedFilters.typeIds || []}
          onToggle={handleToggle("typeIds")}
          showSearch={(options.types?.length ?? 0) > 5}
          defaultExpanded={false}
        />
      )}

      {(options.models?.length ?? 0) > 0 && (
        <FilterSection
          title="Modelo"
          options={options.models}
          selectedIds={selectedFilters.modelIds || []}
          onToggle={handleToggle("modelIds")}
          showSearch={(options.models?.length ?? 0) > 5}
          defaultExpanded={false}
        />
      )}

      {measureOptions.length > 0 && (
        <FilterSection
          title="Medida"
          options={measureOptions}
          selectedIds={selectedFilters.measureIds || []}
          onToggle={handleToggle("measureIds")}
          showSearch={measureOptions.length > 5}
          defaultExpanded={false}
        />
      )}

      {secondaryMeasureOptions.length > 0 && (
        <FilterSection
          title="Medida secundaria"
          options={secondaryMeasureOptions}
          selectedIds={selectedFilters.secondaryMeasureIds || []}
          onToggle={handleToggle("secondaryMeasureIds")}
          showSearch={secondaryMeasureOptions.length > 5}
          defaultExpanded={false}
        />
      )}

      {(options.designs?.length ?? 0) > 0 && (
        <FilterSection
          title="Diseño"
          options={options.designs}
          selectedIds={selectedFilters.designIds || []}
          onToggle={handleToggle("designIds")}
          defaultExpanded={false}
        />
      )}

      {(options.qualifiers?.length ?? 0) > 0 && (
        <FilterSection
          title="Cualificador"
          options={options.qualifiers}
          selectedIds={selectedFilters.qualifiers || []}
          onToggle={handleToggle("qualifiers")}
          defaultExpanded={false}
        />
      )}
    </Box>
  );
};

export default FilterSidebar;
