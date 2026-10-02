import { useCallback, useEffect, useState } from "react";
import { ADMIN_PAGE_SIZE } from "../../constants/x-datagrid/pagination";

export default function useServerPagination(
  fetchFn,
  { initialPageSize = ADMIN_PAGE_SIZE, rowsKey, query = "" } = {}
) {
  const [data, setData] = useState(null);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: initialPageSize });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const loadPage = useCallback(
    async (page, size) => {
      setError(false);
      setLoading(true);
      try {
        const result = await fetchFn(page, size, query);
        setData(result);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    },
    [fetchFn, query]
  );

  // Al cambiar la búsqueda hay que volver a la primera página: la página actual
  // puede no existir en el nuevo conjunto de resultados.
  useEffect(() => {
    setPaginationModel((prev) => (prev.page === 0 ? prev : { ...prev, page: 0 }));
  }, [query]);

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
