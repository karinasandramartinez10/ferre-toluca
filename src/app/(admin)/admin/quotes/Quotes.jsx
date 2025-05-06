"use client";

import { DataGrid } from "@mui/x-data-grid";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { fetchQuotes } from "../../../../api/quote";
import { CustomNoRowsOverlay } from "../../../../components/CustomNoRows";
import { ErrorUI } from "../../../../components/Error";
import { Loading } from "../../../../components/Loading";
import { quotesColumns } from "./columns";

export const Quotes = ({ initialData }) => {
  const [data, setData] = useState(initialData);
  const [page, setPage] = useState(initialData.page);
  const [pageSize, setSize] = useState(initialData.pageSize);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const isFirstLoad = useRef(true);

  const loadData = useCallback(
    async (page, pageSize) => {
      setError(false);
      setLoading(true);
      try {
        const d = await fetchQuotes(page, pageSize);
        setData({ ...d, page, pageSize });
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    if (isFirstLoad.current) {
      // primer mount: no hacemos fetch porque ya vinimos con initialData
      isFirstLoad.current = false;
      return;
    }
    // para cualquier cambio de page/pageSize, incluso volver a 1
    loadData(page, pageSize);
  }, [page, pageSize, loadData]);

  if (loading) {
    return <Loading />;
  }

  if (error)
    return (
      <ErrorUI
        onRetry={() => {
          loadData(initialData.page, initialData.pageSize);
        }}
      />
    );

  return (
    <DataGrid
      rows={data.quotes}
      columns={quotesColumns}
      rowCount={data.totalCount}
      paginationMode="server"
      paginationModel={{ page: page - 1, pageSize }}
      onPaginationModelChange={({ page, pageSize }) => {
        setPage(page + 1);
        setSize(pageSize);
      }}
      pageSizeOptions={[5, 10, 20]}
      disableRowSelectionOnClick
      sx={{
        "& .MuiDataGrid-columnHeaderTitle": {
          fontWeight: 700,
        },
        "&.MuiDataGrid-root .MuiDataGrid-cell:focus-within": {
          outline: "none !important",
        },
      }}
      slots={{
        noRowsOverlay: CustomNoRowsOverlay,
      }}
    />
  );
};
