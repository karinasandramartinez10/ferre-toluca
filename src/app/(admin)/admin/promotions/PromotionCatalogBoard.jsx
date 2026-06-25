"use client";

import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Autocomplete,
  Box,
  Breadcrumbs,
  Button,
  Chip,
  Link,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { Loading } from "../../../../components/Loading";
import { getBrands } from "../../../../api/brands";
import { getMenuTree } from "../../../../api/products";
import { getPromotions } from "../../../../api/promotions";
import { queryKeys } from "../../../../constants/queryKeys";
import { staleTimes, gcTimes } from "../../../../constants/queryConfig";
import {
  getPromotionScope,
  promotionShortLabel,
  SCOPE_KIND_LABELS,
} from "../../../../constants/promotions";
import { toCapitalizeWords } from "../../../../utils/cases";
import useProductSearch from "../../../../hooks/admin/useProductSearch";
import PromotionComposer from "./PromotionComposer";
import ScopeTile from "./ScopeTile";

const EMPTY = [];

const SEGMENTS = [
  { value: "brand", label: "Marcas" },
  { value: "catalog", label: "Catálogo" },
  { value: "product", label: "Producto" },
];

const pluralize = (n, singular) => `Ver ${n} ${singular}${n === 1 ? "" : "s"}`;

const PromotionCatalogBoard = () => {
  const queryClient = useQueryClient();
  const [tab, setTab] = useState("brand");
  const [path, setPath] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [selection, setSelection] = useState([]);
  const [composerOpen, setComposerOpen] = useState(false);
  const [productValue, setProductValue] = useState(null);
  const { options: productOptions, searching, search } = useProductSearch();

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

  const promoByScope = useMemo(() => {
    const map = {};
    (active?.promotions ?? []).forEach((promo) => {
      const scope = getPromotionScope(promo);
      map[`${scope.kind}:${scope.id}`] = promo;
    });
    return map;
  }, [active]);

  const brandTiles = useMemo(
    () =>
      brands.map((b) => ({
        id: b.id,
        name: b.name,
        label: b.name,
        image: { publicId: b.File?.publicId, alt: b.name },
      })),
    [brands]
  );

  const catalogView = useMemo(() => {
    if (path.length === 0) {
      return {
        kind: "category",
        tiles: tree.map((c) => ({
          id: c.id,
          name: c.name,
          label: c.name,
          count: c.productCount,
          childCount: c.subcategories?.length ?? 0,
          childLabel: "subcategoría",
        })),
      };
    }
    if (path.length === 1) {
      const cat = tree.find((c) => c.id === path[0].id);
      return {
        kind: "subcategory",
        tiles: (cat?.subcategories ?? []).map((s) => ({
          id: s.id,
          name: toCapitalizeWords(s.name),
          label: `${path[0].name} › ${toCapitalizeWords(s.name)}`,
          count: s.productCount,
          childCount: s.types?.length ?? 0,
          childLabel: "tipo",
        })),
      };
    }
    const cat = tree.find((c) => c.id === path[0].id);
    const sub = cat?.subcategories?.find((s) => s.id === path[1].id);
    return {
      kind: "type",
      tiles: (sub?.types ?? []).map((t) => ({
        id: t.id,
        name: toCapitalizeWords(t.name),
        label: `${path[1].name} › ${toCapitalizeWords(t.name)}`,
        count: t.productCount,
        childCount: 0,
      })),
    };
  }, [tree, path]);

  const isSelected = (kind, id) => selection.some((s) => s.kind === kind && s.id === id);

  const toggleScope = (item) =>
    setSelection((prev) =>
      prev.some((s) => s.kind === item.kind && s.id === item.id)
        ? prev.filter((s) => !(s.kind === item.kind && s.id === item.id))
        : [...prev, item]
    );

  const removeScope = (kind, id) =>
    setSelection((prev) => prev.filter((s) => !(s.kind === kind && s.id === id)));

  const drillInto = (tile) => {
    setPath((prev) => [...prev, { id: tile.id, name: tile.name }]);
    setFilterText("");
  };

  const goToCrumb = (depth) => {
    setPath((prev) => prev.slice(0, depth));
    setFilterText("");
  };

  const handleSaved = () => {
    setSelection([]);
    queryClient.invalidateQueries({ queryKey: queryKeys.promotionsActive });
  };

  if (loadingBrands || loadingTree) return <Loading />;

  const sourceTiles = tab === "brand" ? brandTiles : catalogView.tiles;
  const currentKind = tab === "brand" ? "brand" : catalogView.kind;
  const filteredTiles = filterText
    ? sourceTiles.filter((t) => t.name.toLowerCase().includes(filterText.toLowerCase()))
    : sourceTiles;

  return (
    <Box>
      {selection.length > 0 && (
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{
            mb: 2,
            p: 1.5,
            borderRadius: 2,
            bgcolor: "grey.light",
            position: "sticky",
            top: 0,
            zIndex: 1,
            flexWrap: "wrap",
            gap: 1,
          }}
        >
          <Typography variant="body2" fontWeight={700} sx={{ flexShrink: 0 }}>
            {selection.length} seleccionado{selection.length > 1 ? "s" : ""}
          </Typography>
          <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap", flexGrow: 1, minWidth: 0 }}>
            {selection.map((s) => (
              <Chip
                key={`${s.kind}:${s.id}`}
                size="small"
                label={`${SCOPE_KIND_LABELS[s.kind]}: ${s.label}`}
                onDelete={() => removeScope(s.kind, s.id)}
              />
            ))}
          </Box>
          <Button size="small" color="inherit" onClick={() => setSelection([])}>
            Limpiar
          </Button>
          <Button size="small" variant="contained" onClick={() => setComposerOpen(true)}>
            Crear promoción
          </Button>
        </Stack>
      )}

      <ToggleButtonGroup
        exclusive
        size="small"
        value={tab}
        onChange={(_e, value) => {
          if (value) {
            setTab(value);
            setPath([]);
            setFilterText("");
          }
        }}
        sx={{ mb: 2, flexWrap: "wrap" }}
      >
        {SEGMENTS.map((s) => (
          <ToggleButton
            key={s.value}
            value={s.value}
            sx={{
              px: 2.5,
              fontWeight: 600,
              "&.Mui-selected": {
                bgcolor: "primary.main",
                color: "#fff",
                "&:hover": { bgcolor: "primary.hover" },
              },
            }}
          >
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
            if (value) toggleScope({ kind: "product", id: value.id, label: value.label });
            setProductValue(null);
          }}
          noOptionsText="Escribe para buscar un producto"
          sx={{ maxWidth: 480 }}
          renderInput={(params) => (
            <TextField {...params} label="Busca un producto para promocionar" />
          )}
        />
      ) : (
        <>
          {tab === "catalog" && (
            <Breadcrumbs separator="›" sx={{ mb: 2 }}>
              {path.length === 0 ? (
                <Typography color="text.primary" fontWeight={700}>
                  Categorías
                </Typography>
              ) : (
                <Link
                  component="button"
                  underline="hover"
                  color="inherit"
                  onClick={() => goToCrumb(0)}
                >
                  Categorías
                </Link>
              )}
              {path.map((node, i) =>
                i === path.length - 1 ? (
                  <Typography key={node.id} color="text.primary" fontWeight={700}>
                    {node.name}
                  </Typography>
                ) : (
                  <Link
                    key={node.id}
                    component="button"
                    underline="hover"
                    color="inherit"
                    onClick={() => goToCrumb(i + 1)}
                  >
                    {node.name}
                  </Link>
                )
              )}
            </Breadcrumbs>
          )}

          <TextField
            size="small"
            placeholder="Filtrar esta vista…"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            sx={{ mb: 2, width: { xs: "100%", sm: 280 } }}
          />

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
                promoLabel={(() => {
                  const promo = promoByScope[`${currentKind}:${tile.id}`];
                  return promo ? promo.label || promotionShortLabel(promo) : null;
                })()}
                onSelect={() => toggleScope({ kind: currentKind, id: tile.id, label: tile.label })}
                drill={
                  tile.childCount > 0
                    ? {
                        label: pluralize(tile.childCount, tile.childLabel),
                        onClick: () => drillInto(tile),
                      }
                    : null
                }
              />
            ))}
          </Box>
        </>
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
