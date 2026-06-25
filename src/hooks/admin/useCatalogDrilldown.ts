import { useCallback, useMemo, useState } from "react";
import { toCapitalizeWords } from "../../utils/cases";
import type {
  CatalogCrumb,
  CatalogView,
  MenuTreeCategory,
  ScopeTileData,
} from "../../types/promotion";

export default function useCatalogDrilldown(tree: MenuTreeCategory[]) {
  const [path, setPath] = useState<CatalogCrumb[]>([]);

  const view = useMemo<CatalogView>(() => {
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

  const drillInto = useCallback(
    (tile: ScopeTileData) => setPath((prev) => [...prev, { id: tile.id, name: tile.name }]),
    []
  );

  const goToCrumb = useCallback((depth: number) => setPath((prev) => prev.slice(0, depth)), []);

  const reset = useCallback(() => setPath([]), []);

  return { path, view, drillInto, goToCrumb, reset };
}
