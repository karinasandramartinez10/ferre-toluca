"use client";

import { Box, Button, Stack } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { fetchQuotes } from "../../../../api/quote";
import { ErrorUI } from "../../../../components/Error";
import { Loading } from "../../../../components/Loading";
import { formatDateDayAbrev } from "../../../../utils/date";
import { formatPhoneNumber } from "../../../../utils/phoneNumber";
import { ViewModalQuote } from "./ViewModalQuote";

export const Quotes = () => {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [open, setOpen] = useState(false);

  const { data } = useSession();

  const columns = [
    { field: "id", headerName: "ID", width: 80 },
    {
      field: "fullname",
      headerName: "Cliente",
      sortable: false,
      width: 170,
      valueGetter: (_, row) =>
        `${row?.User?.firstName || ""} ${row?.User?.lastName || ""}`,
    },
    {
      field: "product",
      headerName: "Producto",
      width: 150,
      valueGetter: (_, row) => row?.Product?.name || "",
    },
    {
      field: "email",
      headerName: "Email",
      width: 170,
      sortable: true,
      valueGetter: (_, row) => row?.User?.email || "",
    },
    {
      field: "phoneNumber",
      headerName: "Teléfono",
      width: 150,
      valueGetter: (_, row) => formatPhoneNumber(row?.User?.phoneNumber) || "",
    },
    {
      field: "createdAt",
      headerName: "Cotización creada",
      width: 140,
      valueFormatter: (val) => {
        if (val == null) {
          return "";
        }
        return formatDateDayAbrev(val);
      },
    },
    {
      field: "actions",
      headerName: "",
      width: 120,
      renderCell: (params) => (
        <Stack>
          <Button
            sx={{ width: 100, height: 35 }}
            onClick={() => {
              handleDetailsClick(params.row.id);
            }}
          >
            Ver más
          </Button>
        </Stack>
      ),
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const fetchedData = await fetchQuotes(data.user.access_token);
        setLoading(false);
        setQuotes(fetchedData);
      } catch (error) {
        setLoading(false);
        setError(true);
      }
    };

    fetchData();
  }, []);

  const handleClose = () => {
    setSelectedQuote(null);
    setOpen(false);
  };

  const handleDetailsClick = (id) => {
    setSelectedQuote(id);
    setOpen(true);
  };

  if (loading) {
    return <Loading />;
  }

  if (error) return <ErrorUI />;

  return (
    <Box sx={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={quotes}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
        pageSizeOptions={[10]}
        disableRowSelectionOnClick
        sx={{
          "& .MuiDataGrid-columnHeaderTitle": {
            fontWeight: 700,
          },
          "&.MuiDataGrid-root .MuiDataGrid-cell:focus-within": {
            outline: "none !important",
          },
        }}
      />
      {selectedQuote && (
        <ViewModalQuote
          header="Información de la cotización"
          open={open}
          onClose={handleClose}
        />
      )}
    </Box>
  );
};
