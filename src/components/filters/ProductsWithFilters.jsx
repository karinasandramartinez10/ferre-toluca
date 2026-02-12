"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Box,
  Grid,
  Button,
  Typography,
  useMediaQuery,
  useTheme,
  Chip,
  Stack,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import {
  useFilterOptions,
  useProductFilters,
  useFilteredProducts,
} from "../../hooks/filters";
import FilterSidebar from "./FilterSidebar";
import MobileFilterDrawer from "./MobileFilterDrawer";
import GroupedProductsList from "../GroupedProductsList";
import { toCapitalizeWords } from "../../utils/cases";

/**
 * Componente principal que integra filtros con lista de productos.
 * Diseñado para ser reutilizable en todas las páginas de productos.
 *
 * @param {Object} props
 * @param {string} props.title - Título de la página.
 * @param {Object} props.fixedFilters - Filtros fijos del contexto (ej: brandId en /brands/[name]).
 * @param {number} props.pageSize - Tamaño de página.
 */
const ProductsWithFilters = ({
  title = "Productos",
  fixedFilters = {},
  pageSize = 10,
}) => {
  const router = useRouter();
  const { data: session } = useSession();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const isAdmin =
    session?.user?.role === "admin" || session?.user?.role === "superadmin";

  // Hooks de filtros
  const {
    filters,
    urlFilters,
    toggleFilter,
    clearFilters,
    hasActiveFilters,
  } = useProductFilters(fixedFilters);

  // Opciones de filtros contextuales
  const { options, loading: optionsLoading } = useFilterOptions(filters);

  // Productos filtrados
  const {
    products,
    count,
    totalPages,
    loading: productsLoading,
    error,
    currentPage,
    setCurrentPage,
  } = useFilteredProducts(filters, pageSize);

  // Los datos de /product/grouped ya vienen en formato {variantGroupKey, variants: [...]}
  const groupedResult = { products, count, totalPages };

  // Chips de filtros activos
  const renderActiveFilters = () => {
    const chips = [];

    const addChips = (key, label, optionsArray) => {
      const ids = urlFilters[key] || [];
      ids.forEach((id) => {
        const option = optionsArray?.find((o) => o.id === id);
        if (option) {
          chips.push(
            <Chip
              key={`${key}-${id}`}
              label={`${label}: ${toCapitalizeWords(option.name)}`}
              onDelete={() => toggleFilter(key, id)}
              size="small"
              sx={{ mr: 0.5, mb: 0.5 }}
            />
          );
        }
      });
    };

    if (!fixedFilters.brandIds?.length) {
      addChips("brandIds", "Marca", options.brands);
    }
    if (!fixedFilters.categoryIds?.length) {
      addChips("categoryIds", "Categoría", options.categories);
    }
    if (!fixedFilters.subcategoryIds?.length) {
      addChips("subcategoryIds", "Subcategoría", options.subcategories);
    }
    if (!fixedFilters.typeIds?.length) {
      addChips("typeIds", "Tipo", options.types);
    }
    addChips("modelIds", "Modelo", options.models);
    addChips("measureIds", "Medida", options.measures);
    addChips("designIds", "Diseño", options.designs);

    return chips;
  };

  const activeFiltersChips = renderActiveFilters();

  return (
    <Box>
      {/* Header con título y botón de filtros móvil */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Box>
          <Typography component="h1" variant="h1">
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {count} producto{count !== 1 ? "s" : ""} encontrado{count !== 1 ? "s" : ""}
          </Typography>
        </Box>

        {isMobile && (
          <Button
            variant="outlined"
            startIcon={<FilterListIcon />}
            onClick={() => setDrawerOpen(true)}
            sx={{ textTransform: "none" }}
          >
            Filtros
            {hasActiveFilters && (
              <Box
                component="span"
                sx={{
                  ml: 1,
                  px: 0.75,
                  py: 0.25,
                  borderRadius: 1,
                  backgroundColor: "primary.main",
                  color: "white",
                  fontSize: "0.75rem",
                }}
              >
                {activeFiltersChips.length}
              </Box>
            )}
          </Button>
        )}
      </Box>

      {/* Chips de filtros activos */}
      {activeFiltersChips.length > 0 && (
        <Stack direction="row" flexWrap="wrap" sx={{ mb: 2 }}>
          {activeFiltersChips}
          <Chip
            label="Limpiar todos"
            onClick={clearFilters}
            size="small"
            variant="outlined"
            sx={{ mb: 0.5 }}
          />
        </Stack>
      )}

      <Grid container spacing={3}>
        {/* Sidebar de filtros (solo desktop) */}
        {!isMobile && (
          <Grid item xs={12} md={3} lg={2.5}>
            <Box
              sx={{
                position: "sticky",
                top: 16,
                maxHeight: "calc(100vh - 32px)",
                overflowY: "auto",
                pr: 1,
              }}
            >
              <FilterSidebar
                options={options}
                selectedFilters={urlFilters}
                fixedFilters={fixedFilters}
                onToggle={toggleFilter}
                onClear={clearFilters}
                hasActiveFilters={hasActiveFilters}
                loading={optionsLoading}
              />
            </Box>
          </Grid>
        )}

        {/* Grid de productos */}
        <Grid item xs={12} md={9} lg={9.5}>
          <GroupedProductsList
            groupedResult={groupedResult}
            loading={productsLoading}
            error={error}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            onProductClick={(id) => router.push(`/product/${id}`)}
            showBtns={!isAdmin}
          />
        </Grid>
      </Grid>

      {/* Drawer de filtros móvil */}
      <MobileFilterDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        options={options}
        selectedFilters={urlFilters}
        fixedFilters={fixedFilters}
        onToggle={toggleFilter}
        onClear={clearFilters}
        hasActiveFilters={hasActiveFilters}
        loading={optionsLoading}
        resultsCount={count}
      />
    </Box>
  );
};

export default ProductsWithFilters;
