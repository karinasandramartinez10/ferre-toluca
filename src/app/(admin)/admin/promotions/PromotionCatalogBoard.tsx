"use client";

import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Autocomplete,
  Box,
  Card,
  IconButton,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { Loading } from "../../../../components/Loading";
import { getBrands } from "../../../../api/brands";
import { getMenuTree } from "../../../../api/products";
import { getPromotions } from "../../../../api/promotions";
import { queryKeys } from "../../../../constants/queryKeys";
import { staleTimes, gcTimes } from "../../../../constants/queryConfig";
import { getPromotionScope, promotionShortLabel } from "../../../../constants/promotions";
import type { ScopeOption, ScopeTileData } from "../../../../types/promotion";
import useProductSearch from "../../../../hooks/admin/useProductSearch";
import useScopeSelection from "../../../../hooks/admin/useScopeSelection";
import useCatalogDrilldown from "../../../../hooks/admin/useCatalogDrilldown";
import ProductResultRow from "../../../../components/ProductResultRow";
import PromotionComposer from "./PromotionComposer";
import ScopeTile from "./ScopeTile";
import ScopeRow from "./ScopeRow";
import ScopeSelectionBar from "./ScopeSelectionBar";
import CatalogBreadcrumbs from "./CatalogBreadcrumbs";

const EMPTY = [];

const SEGMENTS = [
  { value: "product", label: "Producto" },
  { value: "catalog", label: "Catálogo" },
  { value: "brand", label: "Marcas" },
];

const toggleButtonSx = {
  px: 2.5,
  fontWeight: 600,
  "&.Mui-selected": {
    bgcolor: "primary.main",
    color: "#fff",
    "&:hover": { bgcolor: "primary.hover" },
  },
};

const pluralize = (n: number, singular: string) => `Ver ${n} ${singular}${n === 1 ? "" : "s"}`;

const PromotionCatalogBoard = () => {
  const queryClient = useQueryClient();
  const [tab, setTab] = useState("product");
  const [filterText, setFilterText] = useState("");
  const [composerOpen, setComposerOpen] = useState(false);
  const [productValue, setProductValue] = useState<ScopeOption | null>(null);
  const { options: productOptions, searching, search } = useProductSearch();
  const { selection, isSelected, toggle, remove, clear } = useScopeSelection();

  const { data: brands = EMPTY, isLoading: loadingBrands } = useQuery({
    queryKey: queryKeys.brands,
    queryFn: getBrands,
    staleTime: staleTimes.STATIC,
    gcTime: gcTimes.LONG,
  });

  const { data: tree = EMPTY, isLoading: loadingTree } = useQuery({
    queryKey: queryKeys.menuTree,
    queryFn: getMenuTree,
    staleTime: staleTimes.STATIC,
    gcTime: gcTimes.LONG,
  });

  const { data: active } = useQuery({
    queryKey: queryKeys.promotionsActive,
    queryFn: () => getPromotions(1, 200, { status: "active" }),
    staleTime: staleTimes.FREQUENT,
  });

  const { path, view, drillInto, goToCrumb, reset } = useCatalogDrilldown(tree);

  // Todas las promos activas por scope (una categoría puede tener varias).
  const promosByScope = useMemo(() => {
    const map: Record<string, string[]> = {};
    (active?.promotions ?? []).forEach((promo) => {
      const scope = getPromotionScope(promo);
      const key = `${scope.kind}:${scope.id}`;
      (map[key] ??= []).push(`${promo.name} — ${promotionShortLabel(promo)}`);
    });
    return map;
  }, [active]);

  const brandTiles = useMemo<ScopeTileData[]>(
    () =>
      brands.map((b) => ({
        id: b.id,
        name: b.name,
        label: b.name,
        image: { publicId: b.File?.publicId, alt: b.name },
      })),
    [brands]
  );

  const handleTabChange = (value: string | null) => {
    if (!value) return;
    setTab(value);
    reset();
    setFilterText("");
  };

  const handleDrill = (tile: ScopeTileData) => {
    drillInto(tile);
    setFilterText("");
  };

  const handleCrumb = (depth: number) => {
    goToCrumb(depth);
    setFilterText("");
  };

  const handleSaved = () => {
    clear();
    queryClient.invalidateQueries({ queryKey: queryKeys.promotionsActive });
  };

  if (loadingBrands || loadingTree) return <Loading />;

  const sourceTiles = tab === "brand" ? brandTiles : view.tiles;
  const currentKind = tab === "brand" ? "brand" : view.kind;
  const filteredTiles = filterText
    ? sourceTiles.filter((t) => t.name.toLowerCase().includes(filterText.toLowerCase()))
    : sourceTiles;

  return (
    <Box>
      {selection.length > 0 && (
        <ScopeSelectionBar
          selection={selection}
          onRemove={remove}
          onClear={clear}
          onCreate={() => setComposerOpen(true)}
        />
      )}

      <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap", mb: 2 }}>
        <ToggleButtonGroup
          exclusive
          size="small"
          value={tab}
          onChange={(_e, value) => handleTabChange(value)}
          sx={{ flexWrap: "wrap" }}
        >
          {SEGMENTS.map((s) => (
            <ToggleButton key={s.value} value={s.value} sx={toggleButtonSx}>
              {s.label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>

        {tab === "product" ? (
          <Autocomplete
            options={productOptions}
            loading={searching}
            value={productValue}
            getOptionLabel={(o) => o?.label ?? ""}
            isOptionEqualToValue={(o, v) => o.id === v.id}
            onInputChange={(_e, query) => search(query)}
            onChange={(_e, value) => {
              if (value)
                toggle({
                  kind: "product",
                  id: value.id,
                  label: value.label,
                  code: value.code,
                  image: value.image,
                });
              setProductValue(null);
            }}
            noOptionsText="Escribe para buscar un producto"
            sx={{ flexGrow: 1, maxWidth: { sm: 480 } }}
            renderOption={(props, option) => {
              const { key, ...optionProps } = props;
              return (
                <Box component="li" key={key} {...optionProps}>
                  <ProductResultRow
                    name={option.label}
                    sku={option.code}
                    imagePath={option.image}
                  />
                </Box>
              );
            }}
            renderInput={(params) => (
              <TextField {...params} label="Busca un producto para promocionar" />
            )}
          />
        ) : (
          <TextField
            size="small"
            placeholder="Filtrar esta vista…"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            sx={{ flexGrow: 1, maxWidth: { sm: 280 } }}
          />
        )}
      </Box>

      {tab === "product" && (
        <Stack spacing={1} sx={{ mb: 2 }}>
          {selection
            .filter((s) => s.kind === "product")
            .map((s) => (
              <Card
                key={s.id}
                variant="outlined"
                sx={{
                  p: 1.5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 1,
                  borderColor: "primary.main",
                }}
              >
                <ProductResultRow name={s.label} sku={s.code} imagePath={s.image} size={48} />
                <IconButton
                  size="small"
                  onClick={() => remove("product", s.id)}
                  aria-label="Quitar"
                >
                  <Close fontSize="small" />
                </IconButton>
              </Card>
            ))}
        </Stack>
      )}

      {tab === "catalog" && (
        <Box sx={{ mb: 2 }}>
          <CatalogBreadcrumbs path={path} onNavigate={handleCrumb} />
        </Box>
      )}

      {tab === "brand" && (
        <Box
          sx={{
            display: "grid",
            gap: 1.5,
            gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
          }}
        >
          {filteredTiles.map((tile) => (
            <ScopeTile
              key={tile.id}
              name={tile.name}
              count={tile.count}
              label={tile.label}
              image={tile.image}
              selected={isSelected(currentKind, tile.id)}
              promos={promosByScope[`${currentKind}:${tile.id}`]}
              onSelect={() => toggle({ kind: currentKind, id: tile.id, label: tile.label })}
              drill={
                tile.childCount > 0
                  ? {
                      label: pluralize(tile.childCount, tile.childLabel),
                      onClick: () => handleDrill(tile),
                    }
                  : null
              }
            />
          ))}
        </Box>
      )}

      {tab === "catalog" && (
        <Stack spacing={1}>
          {filteredTiles.map((tile) => (
            <ScopeRow
              key={tile.id}
              name={tile.name}
              count={tile.count}
              selected={isSelected(currentKind, tile.id)}
              promos={promosByScope[`${currentKind}:${tile.id}`]}
              onSelect={() => toggle({ kind: currentKind, id: tile.id, label: tile.label })}
              drill={
                tile.childCount > 0
                  ? {
                      label: pluralize(tile.childCount, tile.childLabel),
                      onClick: () => handleDrill(tile),
                    }
                  : null
              }
            />
          ))}
        </Stack>
      )}

      <PromotionComposer
        open={composerOpen}
        onClose={() => setComposerOpen(false)}
        scopes={selection}
        onSaved={handleSaved}
      />
    </Box>
  );
};

export default PromotionCatalogBoard;
