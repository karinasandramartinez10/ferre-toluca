"use client";

import { DataGrid } from "@mui/x-data-grid";
import { useSnackbar } from "notistack";
import React, { useCallback, useEffect, useState } from "react";
import { Box, Button } from "@mui/material";
import { fetchQuotes, updateQuote } from "../../../../api/quote";
import { CustomNoRowsOverlay } from "../../../../components/CustomNoRows";
import { CustomToolbar } from "../../../../components/DataGrid/CustomToolbar";
import { CustomFooter } from "../../../../components/DataGrid/CustomFooter";
import { ErrorUI } from "../../../../components/Error";
import { Loading } from "../../../../components/Loading";
import { localeText } from "../../../../constants/x-datagrid/localeText";
import { getQuoteColumns } from "./columns";
import { useStatusLogs } from "../../../../hooks/logs/useStatusLogs";
import { buildTableHtml, openPrintWindow } from "../../../../utils/print";
import { statusLabelMap } from "../../../../helpers/quotes";

export const Quotes = () => {
  const [quotes, setQuotes] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const { enqueueSnackbar } = useSnackbar();
  const { appendLog } = useStatusLogs();

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setLoading(true);
        const { quotes, totalCount } = await fetchQuotes(
          paginationModel.page + 1,
          paginationModel.pageSize
        );
        if (active) {
          setQuotes(quotes);
          setTotalCount(totalCount);
        }
      } catch {
        if (active) setError(true);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [paginationModel]);

  const handlePrint = useCallback(() => {
    const headers = ["# Orden", "Cliente", "Fecha", "Estado"];

    const rows = (Array.isArray(quotes) ? quotes : []).map((q) => {
      const dateStr = q?.createdAt
        ? new Date(q.createdAt).toLocaleString("es-MX")
        : "";
      const name = q?.User
        ? `${q.User.firstName ?? ""} ${q.User.lastName ?? ""}`.trim()
        : "";
      const statusLabel = statusLabelMap[q?.status] ?? q?.status ?? "";
      return `<tr>
        <td>${q?.orderNumber ?? ""}</td>
        <td>${name}</td>
        <td>${dateStr}</td>
        <td>${statusLabel}</td>
      </tr>`;
    });

    const html = buildTableHtml({
      caption: "Listado de cotizaciones",
      headers,
      rows,
    });

    openPrintWindow(html, { title: "Cotizaciones" });
  }, [quotes]);

  const handleStatusChange = useCallback(
    async (id, oldStatus, newStatus) => {
      setUpdatingId(id);
      try {
        await updateQuote(id, { status: newStatus });
        setQuotes((prev) =>
          prev.map((q) => (q.id === id ? { ...q, status: newStatus } : q))
        );

        await appendLog(id, {
          oldStatus,
          newStatus,
          changedAt: new Date().toISOString(),
        });

        enqueueSnackbar("Estado actualizado correctamente", {
          variant: "success",
        });
      } catch (err) {
        console.error("Error cambiando estado:", err);
        enqueueSnackbar("Error al actualizar el estado", {
          variant: "error",
        });
      } finally {
        setUpdatingId(null);
      }
    },
    [appendLog, enqueueSnackbar]
  );

  const finishEdit = useCallback(() => {
    setEditingId(null);
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (error) return <ErrorUI />;

  return (
    <DataGrid
      localeText={localeText}
      rows={quotes}
      columns={getQuoteColumns({
        updatingId,
        editingId,
        handleStatusChange,
        handleStatusChange,
        setEditingId,
        finishEdit,
      })}
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
        "& .MuiDataGrid-row:hover": {
          backgroundColor: (theme) => theme.palette.action.hover,
        },
        "& .statusCell:hover .editIcon": {
          display: "block",
        },
        "& .MuiDataGrid-row:hover .statusCell .editIcon": {
          display: "block",
        },
        // resaltar fila al hover
        "& .MuiDataGrid-row:hover": {
          backgroundColor: (theme) => theme.palette.action.hover,
        },
      }}
      slots={{
        noRowsOverlay: CustomNoRowsOverlay,
        toolbar: CustomToolbar,
        footer: CustomFooter,
      }}
      slotProps={{
        toolbar: { onPrint: handlePrint },
      }}
    />
  );
};
