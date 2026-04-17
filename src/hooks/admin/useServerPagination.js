import { useCallback, useEffect, useState } from "react";

/**
 * Hook para manejar paginación server-side en DataGrids admin.
 * Encapsula el patrón: state de paginación + loading + error + fetch.
 *
 * @param {Function} fetchFn - Función async que recibe (page, size) y retorna data.
 * @param {Object} options
 * @param {number} [options.initialPageSize=20] - Tamaño de página inicial.
 * @returns {Object}
 */
export default function useServerPagination(fetchFn, { initialPageSize = 20, rowsKey } = {}) {
  const [data, setData] = useState(null);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: initialPageSize });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const loadPage = useCallback(
    async (page, size) => {
      setError(false);
      setLoading(true);
      try {
        const result = await fetchFn(page, size);
        setData(result);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    },
    [fetchFn]
  );

  useEffect(() => {
    loadPage(paginationModel.page + 1, paginationModel.pageSize);
  }, [paginationModel, loadPage]);

  const reload = useCallback(() => {
    loadPage(paginationModel.page + 1, paginationModel.pageSize);
  }, [loadPage, paginationModel]);

  const updateRow = useCallback(
    (id, updater) => {
      setData((prev) => {
        if (!prev || !rowsKey || !Array.isArray(prev[rowsKey])) return prev;
        return {
          ...prev,
          [rowsKey]: prev[rowsKey].map((row) =>
            row.id === id
              ? typeof updater === "function"
                ? updater(row)
                : { ...row, ...updater }
              : row
          ),
        };
      });
    },
    [rowsKey]
  );

  return {
    data,
    loading,
    error,
    paginationModel,
    setPaginationModel,
    reload,
    updateRow,
  };
}
