"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

/**
 * Hook para manejar el estado de filtros de productos.
 * Sincroniza los filtros con los query params de la URL.
 *
 * @param {Object} fixedFilters - Filtros fijos que no se pueden cambiar (contexto de la página).
 * @returns {Object} - Estado de filtros y funciones para modificarlos.
 */
export default function useProductFilters(fixedFilters = {}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Parsear arrays de IDs desde query params
  const parseIds = (param) => {
    const value = searchParams.get(param);
    if (!value) return [];
    return value.split(",").map(Number).filter(Boolean);
  };

  // Filtros desde URL
  const urlFilters = useMemo(
    () => ({
      brandIds: parseIds("brandIds"),
      categoryIds: parseIds("categoryIds"),
      subcategoryIds: parseIds("subcategoryIds"),
      typeIds: parseIds("typeIds"),
      modelIds: parseIds("modelIds"),
      measureIds: parseIds("measureIds"),
      designIds: parseIds("designIds"),
      q: searchParams.get("q") || "",
    }),
    [searchParams]
  );

  // Combinar filtros fijos con filtros de URL
  const filters = useMemo(() => {
    const combined = { ...urlFilters };

    // Los filtros fijos tienen prioridad
    if (fixedFilters.brandIds?.length) {
      combined.brandIds = fixedFilters.brandIds;
    }
    if (fixedFilters.categoryIds?.length) {
      combined.categoryIds = fixedFilters.categoryIds;
    }
    if (fixedFilters.subcategoryIds?.length) {
      combined.subcategoryIds = fixedFilters.subcategoryIds;
    }
    if (fixedFilters.typeIds?.length) {
      combined.typeIds = fixedFilters.typeIds;
    }
    if (fixedFilters.q) {
      combined.q = fixedFilters.q;
    }

    return combined;
  }, [urlFilters, fixedFilters]);

  // Actualizar URL con nuevos filtros
  const updateUrl = useCallback(
    (newFilters) => {
      const params = new URLSearchParams();

      // Solo agregar filtros que no son fijos
      Object.entries(newFilters).forEach(([key, value]) => {
        // Saltar filtros fijos (excepto q que debe mantenerse en la URL)
        if (key !== "q" && (fixedFilters[key]?.length || fixedFilters[key])) return;

        if (Array.isArray(value) && value.length > 0) {
          params.set(key, value.join(","));
        } else if (typeof value === "string" && value) {
          params.set(key, value);
        }
      });

      // Mantener el id de la URL si existe (para páginas como /brands/[name]?id=X)
      const currentId = searchParams.get("id");
      if (currentId) {
        params.set("id", currentId);
      }

      // Mantener el q de búsqueda si es un filtro fijo
      if (fixedFilters.q && !params.has("q")) {
        params.set("q", fixedFilters.q);
      }

      const queryString = params.toString();
      const newUrl = queryString ? `${pathname}?${queryString}` : pathname;

      router.push(newUrl, { scroll: false });
    },
    [pathname, router, searchParams, fixedFilters]
  );

  // Toggle un ID en un array de filtros
  const toggleFilter = useCallback(
    (filterKey, id) => {
      const currentIds = urlFilters[filterKey] || [];
      const newIds = currentIds.includes(id)
        ? currentIds.filter((i) => i !== id)
        : [...currentIds, id];

      updateUrl({
        ...urlFilters,
        [filterKey]: newIds,
      });
    },
    [urlFilters, updateUrl]
  );

  // Establecer un filtro completo
  const setFilter = useCallback(
    (filterKey, ids) => {
      updateUrl({
        ...urlFilters,
        [filterKey]: ids,
      });
    },
    [urlFilters, updateUrl]
  );

  // Limpiar todos los filtros (excepto los fijos)
  const clearFilters = useCallback(() => {
    updateUrl({
      brandIds: [],
      categoryIds: [],
      subcategoryIds: [],
      typeIds: [],
      modelIds: [],
      measureIds: [],
      designIds: [],
      q: "",
    });
  }, [updateUrl]);

  // Verificar si hay filtros activos (excluyendo los fijos)
  const hasActiveFilters = useMemo(() => {
    return Object.entries(urlFilters).some(([key, value]) => {
      if (fixedFilters[key]?.length || fixedFilters[key]) return false;
      if (Array.isArray(value)) return value.length > 0;
      return Boolean(value);
    });
  }, [urlFilters, fixedFilters]);

  return {
    filters,
    urlFilters,
    fixedFilters,
    toggleFilter,
    setFilter,
    clearFilters,
    hasActiveFilters,
  };
}
