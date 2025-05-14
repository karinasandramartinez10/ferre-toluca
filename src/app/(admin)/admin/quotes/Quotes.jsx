"use client";

import { DataGrid } from "@mui/x-data-grid";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { fetchQuotes } from "../../../../api/quote";
import { CustomNoRowsOverlay } from "../../../../components/CustomNoRows";
import { ErrorUI } from "../../../../components/Error";
import { Loading } from "../../../../components/Loading";
import { localeText } from "../../../../constants/x-datagrid/localeText";
import { quotesColumns } from "./columns";

export const Quotes = () => {
  const [data, setData] = useState([]);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const isFirstLoad = useRef(true);

  const loadData = useCallback(async (page, pageSize) => {
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
  }, []);

  useEffect(() => {
    if (isFirstLoad.current) {
      // primer mount: no hacemos fetch porque ya vinimos con initialData
      isFirstLoad.current = false;
      return;
    }
    // para cualquier cambio de page/pageSize, incluso volver a 1
    loadData(paginationModel.page + 1, paginationModel.pageSize);
  }, [paginationModel, loadData]);

  if (loading) {
    return <Loading />;
  }

  if (error)
    return (
      <ErrorUI
        onRetry={() => {
          loadData(page, pageSize);
        }}
      />
    );

  return (
    <DataGrid
      localeText={localeText}
      rows={data.quotes}
      columns={quotesColumns}
      rowCount={data.totalCount}
      paginationMode="server"
      paginationModel={paginationModel}
      onPaginationModelChange={setPaginationModel}
      pageSizeOptions={[10, 25, 50]}
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
