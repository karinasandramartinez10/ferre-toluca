"use client";

import { Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { fetchQuotes } from "../../../../api/quote";
import { CustomNoRowsOverlay } from "../../../../components/CustomNoRows";
import { ErrorUI } from "../../../../components/Error";
import { Loading } from "../../../../components/Loading";
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

  const { data } = useSession();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { quotes, totalCount } = await fetchQuotes(
          data.user.access_token,
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
  }, [data.user.access_token, paginationModel]);

  if (loading) {
    return <Loading />;
  }

  if (error) return <ErrorUI />;

  return (
    <Box sx={{ height: { xs: 550, md: 700 }, width: "100%" }}>
      <DataGrid
        rows={quotes}
        columns={quotesColumns}
        rowCount={totalCount}
        paginationMode="server"
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
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
    </Box>
  );
};
