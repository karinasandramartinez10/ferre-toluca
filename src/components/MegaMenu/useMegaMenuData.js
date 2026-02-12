"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMenuTree } from "../../api/products";
import { queryKeys } from "../../constants/queryKeys";
import { staleTimes, gcTimes } from "../../constants/queryConfig";

/**
 * Hook para manejar datos del mega menu.
 * Usa el endpoint /product/menu-tree que devuelve el árbol completo
 * con solo categorías/subcategorías/tipos que tienen productos.
 *
 * @param {boolean} enabled - Si el menú está abierto (activa el fetch).
 * @param {Array} serverCategories - Categorías del server (tienen `path` para URLs).
 */
export default function useMegaMenuData(enabled = false, serverCategories = []) {
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const [activeSubcategoryId, setActiveSubcategoryId] = useState(null);

  // Fetch del árbol completo en una sola llamada
  const { data: tree = [], isLoading: loadingTree } = useQuery({
    queryKey: queryKeys.menuTree,
    queryFn: getMenuTree,
    enabled,
    staleTime: staleTimes.STATIC,
    gcTime: gcTimes.LONG,
  });

  // Map de id → path desde las categorías del server (el tree no trae path)
  const categoryPathMap = useMemo(() => {
    const map = {};
    serverCategories.forEach((cat) => {
      map[cat.id] = cat.path;
    });
    return map;
  }, [serverCategories]);

  // Categorías del tree enriquecidas con path
  const categories = useMemo(
    () =>
      tree.map((cat) => ({
        ...cat,
        path: categoryPathMap[cat.id] || cat.name,
      })),
    [tree, categoryPathMap]
  );

  // Agrupar subcategorías por categoryId (directo del árbol)
  const subcategoriesByCategory = useMemo(() => {
    const map = {};
    tree.forEach((cat) => {
      if (cat.subcategories?.length) {
        map[cat.id] = cat.subcategories;
      }
    });
    return map;
  }, [tree]);

  // Agrupar tipos por subcategoryId (directo del árbol)
  const typesBySubcategory = useMemo(() => {
    const map = {};
    tree.forEach((cat) => {
      cat.subcategories?.forEach((sub) => {
        if (sub.types?.length) {
          map[sub.id] = sub.types;
        }
      });
    });
    return map;
  }, [tree]);

  // Set de categoryIds que tienen subcategorías
  const categoriesWithSubs = useMemo(
    () => new Set(Object.keys(subcategoriesByCategory).map(Number)),
    [subcategoriesByCategory]
  );

  // Set de subcategoryIds que tienen tipos
  const subcategoriesWithTypes = useMemo(
    () => new Set(Object.keys(typesBySubcategory).map(Number)),
    [typesBySubcategory]
  );

  // Subcategorías de la categoría activa
  const activeSubcategories = activeCategoryId
    ? subcategoriesByCategory[activeCategoryId] || []
    : [];

  // Tipos de la subcategoría activa
  const activeTypes = activeSubcategoryId
    ? typesBySubcategory[activeSubcategoryId] || []
    : [];

  const selectCategory = (categoryId) => {
    setActiveCategoryId(categoryId);
    setActiveSubcategoryId(null);
  };

  const selectSubcategory = (subcategoryId) => {
    setActiveSubcategoryId(subcategoryId);
  };

  const reset = () => {
    setActiveCategoryId(null);
    setActiveSubcategoryId(null);
  };

  return {
    categories,
    subcategories: activeSubcategories,
    types: activeTypes,
    loadingTree,
    loadingSubcategories: false,
    loadingTypes: false,
    activeCategoryId,
    activeSubcategoryId,
    categoriesWithSubs,
    subcategoriesWithTypes,
    subcategoriesByCategory,
    typesBySubcategory,
    selectCategory,
    selectSubcategory,
    reset,
  };
}
