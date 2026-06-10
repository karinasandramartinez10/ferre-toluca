"use client";

import { useCallback, useState } from "react";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import { Block } from "@mui/icons-material";
import { Box, Button, Chip } from "@mui/material";
import { useSnackbar } from "notistack";
import { getInvitations, createInvitation, revokeInvitation } from "../../../../api/invitations";
import { CustomFooter } from "../../../../components/DataGrid/CustomFooter";
import { CustomNoRowsOverlay } from "../../../../components/CustomNoRows";
import { localeText } from "../../../../constants/x-datagrid/localeText";
import { Loading } from "../../../../components/Loading";
import { ErrorUI } from "../../../../components/Error";
import useServerPagination from "../../../../hooks/admin/useServerPagination";
import InvitationModal from "./InvitationModal";
import {
  INVITATION_STATUS_COLORS,
  INVITATION_STATUS_LABELS,
} from "../../../../constants/statusMaps";

const getColumns = (onRevoke) => [
  { field: "email", headerName: "Email", width: 250 },
  { field: "companyName", headerName: "Empresa", width: 180, valueFormatter: (v) => v || "—" },
  {
    field: "status",
    headerName: "Status",
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
    width: 180,
    valueFormatter: (v) => (v ? new Date(v).toLocaleDateString("es-MX") : "—"),
  },
  {
    field: "createdAt",
    headerName: "Creada",
    width: 180,
    valueFormatter: (v) => (v ? new Date(v).toLocaleDateString("es-MX") : "—"),
  },
  {
    field: "actions",
    type: "actions",
    headerName: "Acciones",
    width: 100,
    getActions: ({ row }) =>
      row.status === "pending"
        ? [
            <GridActionsCellItem
              key={`revoke-${row.id}`}
              icon={<Block />}
              label="Revocar"
              onClick={() => onRevoke(row.id)}
              color="error"
            />,
          ]
        : [],
  },
];

const fetchInvitations = (page, size) => getInvitations(page, size);

const Invitations = () => {
  const { data, loading, error, paginationModel, setPaginationModel, reload } =
    useServerPagination(fetchInvitations);
  const [modalOpen, setModalOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const handleRevoke = useCallback(
    async (id) => {
      try {
        await revokeInvitation(id);
        enqueueSnackbar("Invitación revocada", { variant: "success" });
        reload();
      } catch {
        enqueueSnackbar("Error al revocar invitación", { variant: "error" });
      }
    },
    [enqueueSnackbar, reload]
  );

  const handleCreate = useCallback(
    async (values) => {
      try {
        await createInvitation(values);
        enqueueSnackbar("Invitación enviada", { variant: "success" });
        setModalOpen(false);
        reload();
      } catch (err) {
        enqueueSnackbar(err?.message || "Error al enviar invitación", { variant: "error" });
      }
    },
    [enqueueSnackbar, reload]
  );

  if (loading && !data) return <Loading />;
  if (error) return <ErrorUI onRetry={reload} message="No pudimos cargar las invitaciones" />;

  return (
    <>
      <Box sx={{ mb: 2 }}>
        <Button variant="contained" onClick={() => setModalOpen(true)}>
          Enviar invitación
        </Button>
      </Box>
      <DataGrid
        localeText={localeText}
        rows={data?.invitations || []}
        columns={getColumns(handleRevoke)}
        rowCount={data?.count || 0}
        paginationMode="server"
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[10, 20, 50]}
        disableRowSelectionOnClick
        sx={{
          height: 700,
          "& .MuiDataGrid-columnHeaderTitle": { fontWeight: 700 },
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
