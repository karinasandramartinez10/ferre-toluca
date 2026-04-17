"use client";

import { useCallback, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Chip, Select, MenuItem, CircularProgress, Box } from "@mui/material";
import { useSnackbar } from "notistack";
import { getContactRequests, updateContactRequestStatus } from "../../../../api/contactRequests";
import { createInvitation } from "../../../../api/invitations";
import { CustomToolbar } from "../../../../components/DataGrid/CustomToolbar";
import { CustomFooter } from "../../../../components/DataGrid/CustomFooter";
import { CustomNoRowsOverlay } from "../../../../components/CustomNoRows";
import { localeText } from "../../../../constants/x-datagrid/localeText";
import { Loading } from "../../../../components/Loading";
import { ErrorUI } from "../../../../components/Error";
import useServerPagination from "../../../../hooks/admin/useServerPagination";
import {
  CONTACT_REQUEST_STATUS_COLORS,
  CONTACT_REQUEST_STATUS_LABELS,
  CONTACT_REQUEST_STATUS_OPTIONS,
  CONTACT_REQUEST_TERMINAL_STATUSES,
} from "../../../../constants/statusMaps";

const isTerminal = (status) => CONTACT_REQUEST_TERMINAL_STATUSES.includes(status);

const getColumns = (onStatusChange, processingIds) => [
  {
    field: "fullName",
    headerName: "Nombre",
    width: 180,
    valueGetter: (_, row) => `${row.firstName} ${row.lastName}`,
  },
  { field: "email", headerName: "Email", width: 230 },
  { field: "phoneNumber", headerName: "Teléfono", width: 150, valueFormatter: (v) => v || "—" },
  { field: "companyName", headerName: "Empresa", width: 160, valueFormatter: (v) => v || "—" },
  {
    field: "message",
    headerName: "Mensaje",
    width: 200,
    valueFormatter: (v) => (v ? (v.length > 50 ? v.slice(0, 50) + "..." : v) : "—"),
  },
  {
    field: "status",
    headerName: "Status",
    width: 160,
    renderCell: ({ row }) => {
      const isProcessing = processingIds.has(row.id);

      if (isProcessing) {
        return (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CircularProgress size={16} />
            <Chip
              label={CONTACT_REQUEST_STATUS_LABELS[row.status]}
              size="small"
              color={CONTACT_REQUEST_STATUS_COLORS[row.status] || "default"}
              variant="filled"
            />
          </Box>
        );
      }

      if (isTerminal(row.status)) {
        return (
          <Chip
            label={CONTACT_REQUEST_STATUS_LABELS[row.status]}
            size="small"
            color={CONTACT_REQUEST_STATUS_COLORS[row.status] || "default"}
            variant="filled"
          />
        );
      }

      return (
        <Select
          value={row.status}
          size="small"
          onChange={(e) => onStatusChange(row, e.target.value)}
          sx={{
            minWidth: 130,
            "& .MuiOutlinedInput-notchedOutline": { border: "none" },
          }}
        >
          {CONTACT_REQUEST_STATUS_OPTIONS.map((s) => (
            <MenuItem key={s} value={s}>
              <Chip
                label={CONTACT_REQUEST_STATUS_LABELS[s]}
                size="small"
                color={CONTACT_REQUEST_STATUS_COLORS[s] || "default"}
                variant="filled"
              />
            </MenuItem>
          ))}
        </Select>
      );
    },
  },
  {
    field: "createdAt",
    headerName: "Fecha",
    width: 140,
    valueFormatter: (v) => (v ? new Date(v).toLocaleDateString("es-MX") : "—"),
  },
];

const fetchContactRequests = (page, size) => getContactRequests(page, size);

const ContactRequests = () => {
  const { data, loading, error, paginationModel, setPaginationModel, reload, updateRow } =
    useServerPagination(fetchContactRequests, { rowsKey: "contactRequests" });
  const { enqueueSnackbar } = useSnackbar();
  const [processingIds, setProcessingIds] = useState(new Set());

  const addProcessing = (id) => setProcessingIds((prev) => new Set(prev).add(id));
  const removeProcessing = (id) =>
    setProcessingIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });

  const handleStatusChange = useCallback(
    async (row, newStatus) => {
      const prevStatus = row.status;

      // Optimistic update
      updateRow(row.id, { status: newStatus });
      addProcessing(row.id);

      try {
        if (newStatus === "invited") {
          await createInvitation({
            email: row.email,
            companyName: row.companyName || undefined,
          });
          try {
            await updateContactRequestStatus(row.id, "invited");
          } catch {
            enqueueSnackbar(
              "Invitación enviada pero no se pudo actualizar el status. Recarga la página.",
              { variant: "warning" }
            );
            return;
          }
          enqueueSnackbar(`Invitación enviada a ${row.email}`, { variant: "success" });
        } else {
          await updateContactRequestStatus(row.id, newStatus);
          enqueueSnackbar("Status actualizado", { variant: "success" });
        }
      } catch (err) {
        updateRow(row.id, { status: prevStatus });
        enqueueSnackbar(err?.message || "Error al actualizar", { variant: "error" });
      } finally {
        removeProcessing(row.id);
      }
    },
    [enqueueSnackbar, updateRow]
  );

  if (loading && !data) return <Loading />;
  if (error) return <ErrorUI onRetry={reload} message="No pudimos cargar las solicitudes" />;

  return (
    <DataGrid
      localeText={localeText}
      rows={data?.contactRequests || []}
      columns={getColumns(handleStatusChange, processingIds)}
      rowCount={data?.count || 0}
      paginationMode="server"
      paginationModel={paginationModel}
      onPaginationModelChange={setPaginationModel}
      pageSizeOptions={[10, 20, 50]}
      disableRowSelectionOnClick
      getRowClassName={({ row }) => (isTerminal(row.status) ? "row-terminal" : "")}
      sx={{
        height: 700,
        "& .MuiDataGrid-columnHeaderTitle": { fontWeight: 700 },
        "& .row-terminal": { opacity: 0.5, pointerEvents: "none" },
      }}
      slots={{
        toolbar: CustomToolbar,
        noRowsOverlay: CustomNoRowsOverlay,
        footer: CustomFooter,
      }}
    />
  );
};

export default ContactRequests;
