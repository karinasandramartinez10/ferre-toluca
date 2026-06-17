"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import { Block, PersonOutline } from "@mui/icons-material";
import { Button, Chip, Stack, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import { differenceInCalendarDays, parseISO } from "date-fns";
import { getInvitations, createInvitation, revokeInvitation } from "../../../../api/invitations";
import { CustomFooter } from "../../../../components/DataGrid/CustomFooter";
import { CustomNoRowsOverlay } from "../../../../components/CustomNoRows";
import { localeText } from "../../../../constants/x-datagrid/localeText";
import { Loading } from "../../../../components/Loading";
import { ErrorUI } from "../../../../components/Error";
import FilterSelect from "../../../../components/FilterSelect";
import useServerPagination from "../../../../hooks/admin/useServerPagination";
import { queryKeys } from "../../../../constants/queryKeys";
import { formatShortDate } from "../../../../utils/date";
import InvitationModal from "./InvitationModal";
import {
  INVITATION_STATUS_COLORS,
  INVITATION_STATUS_LABELS,
} from "../../../../constants/statusMaps";

const STATUS_FILTERS = [
  { value: "pending", label: "Pendientes" },
  { value: "accepted", label: "Aceptadas" },
  { value: "expired", label: "Expiradas" },
  { value: "revoked", label: "Revocadas" },
  { value: "", label: "Todas" },
];

const ExpiryCell = ({ row }) => {
  if (row.status !== "pending") {
    return (
      <Typography variant="body2" color="text.secondary">
        {formatShortDate(row.expiresAt)}
      </Typography>
    );
  }

  const days = differenceInCalendarDays(parseISO(row.expiresAt), new Date());

  if (days < 0) {
    return <Chip label="Vencida" size="small" color="error" variant="outlined" />;
  }

  const label = days === 0 ? "Expira hoy" : `Expira en ${days} ${days === 1 ? "día" : "días"}`;
  const soon = days <= 2;

  return (
    <Chip
      label={label}
      size="small"
      color={soon ? "warning" : "default"}
      variant={soon ? "filled" : "outlined"}
    />
  );
};

const getColumns = (onRevoke, onViewClient) => [
  { field: "email", headerName: "Email", width: 240 },
  { field: "companyName", headerName: "Empresa", width: 170, valueFormatter: (v) => v || "—" },
  {
    field: "status",
    headerName: "Estado",
    width: 130,
    renderCell: ({ value }) => (
      <Chip
        label={INVITATION_STATUS_LABELS[value] || value}
        size="small"
        color={INVITATION_STATUS_COLORS[value] || "default"}
      />
    ),
  },
  {
    field: "expiresAt",
    headerName: "Expira",
    width: 160,
    renderCell: (params) => <ExpiryCell row={params.row} />,
  },
  {
    field: "createdAt",
    headerName: "Creada",
    width: 130,
    valueFormatter: (v) => formatShortDate(v),
  },
  {
    field: "actions",
    type: "actions",
    headerName: "Acciones",
    width: 130,
    getActions: ({ row }) => {
      if (row.status === "pending") {
        return [
          <GridActionsCellItem
            key={`revoke-${row.id}`}
            icon={<Block />}
            label="Revocar"
            onClick={() => onRevoke(row.id)}
            color="error"
          />,
        ];
      }
      if (row.status === "accepted") {
        return [
          <GridActionsCellItem
            key={`view-${row.id}`}
            icon={<PersonOutline />}
            label="Ver en Clientes"
            onClick={onViewClient}
          />,
        ];
      }
      return [];
    },
  },
];

const Invitations = () => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState("pending");
  const [modalOpen, setModalOpen] = useState(false);

  const fetchInvitations = useCallback(
    (page, size) => getInvitations(page, size, statusFilter || undefined),
    [statusFilter]
  );

  const { data, loading, error, paginationModel, setPaginationModel, reload } =
    useServerPagination(fetchInvitations);

  // Reset a página 1 cuando cambia el filtro (solo si no estamos ya en la 1)
  useEffect(() => {
    setPaginationModel((prev) => (prev.page === 0 ? prev : { ...prev, page: 0 }));
  }, [statusFilter, setPaginationModel]);

  const handleViewClient = useCallback(() => {
    router.push("/admin/clients?tab=clientes");
  }, [router]);

  const handleRevoke = useCallback(
    async (id) => {
      try {
        await revokeInvitation(id);
        enqueueSnackbar("Invitación revocada", { variant: "success" });
        reload();
        queryClient.invalidateQueries({ queryKey: queryKeys.funnelCounts });
      } catch {
        enqueueSnackbar("Error al revocar invitación", { variant: "error" });
      }
    },
    [enqueueSnackbar, reload, queryClient]
  );

  const handleCreate = useCallback(
    async (values) => {
      try {
        await createInvitation(values);
        enqueueSnackbar("Invitación enviada", { variant: "success" });
        setModalOpen(false);
        reload();
        // POST /invitations transiciona la solicitud activa de ese email a invited,
        // así que refresca también los badges del funnel (solicitudes + invitaciones).
        queryClient.invalidateQueries({ queryKey: queryKeys.funnelCounts });
      } catch (err) {
        enqueueSnackbar(err?.message || "Error al enviar invitación", { variant: "error" });
      }
    },
    [enqueueSnackbar, reload, queryClient]
  );

  if (loading && !data) return <Loading />;
  if (error) return <ErrorUI onRetry={reload} message="No pudimos cargar las invitaciones" />;

  return (
    <>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <FilterSelect value={statusFilter} onChange={setStatusFilter} options={STATUS_FILTERS} />
        <Button variant="contained" onClick={() => setModalOpen(true)}>
          Enviar invitación
        </Button>
      </Stack>

      <DataGrid
        localeText={localeText}
        rows={data?.invitations || []}
        columns={getColumns(handleRevoke, handleViewClient)}
        rowCount={data?.count || 0}
        paginationMode="server"
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[10, 20, 50]}
        disableRowSelectionOnClick
        getRowClassName={({ row }) =>
          row.status === "expired" || row.status === "revoked" ? "row-muted" : ""
        }
        sx={{
          height: 700,
          "& .MuiDataGrid-columnHeaderTitle": { fontWeight: 700 },
          "& .row-muted": { opacity: 0.6 },
        }}
        slots={{
          noRowsOverlay: CustomNoRowsOverlay,
          footer: CustomFooter,
        }}
        slotProps={{ noRowsOverlay: { message: "Aún no hay invitaciones" } }}
      />

      <InvitationModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreate}
      />
    </>
  );
};

export default Invitations;
