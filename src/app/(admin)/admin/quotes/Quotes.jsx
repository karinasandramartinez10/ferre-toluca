"use client";

import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { fetchQuotes } from "../../../../api/quote";
import { CustomNoRowsOverlay } from "../../../../components/CustomNoRows";
import { ErrorUI } from "../../../../components/Error";
import { Loading } from "../../../../components/Loading";
import { localeText } from "../../../../constants/x-datagrid/localeText";
import { quotesColumns } from "./columns";

export const Quotes = () => {
  const [quotes, setQuotes] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { quotes, totalCount } = await fetchQuotes(
          paginationModel.page + 1, // Ajustar para backend (MUI usa base 0, backend usa base 1)
          paginationModel.pageSize
        );
        setLoading(false);
        setQuotes(quotes);
        setTotalCount(totalCount || 0);
      } catch (error) {
        setLoading(false);
        setError(true);
      }
    };
    fetchData();
  }, [paginationModel]);

  if (loading) {
    return <Loading />;
  }

  if (error) return <ErrorUI />;

  return (
    <DataGrid
      localeText={localeText}
      rows={quotes}
      columns={quotesColumns}
      rowCount={totalCount}
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
