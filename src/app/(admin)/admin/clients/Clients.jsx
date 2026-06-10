"use client";

import { useCallback, useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button, Chip, Stack, TextField } from "@mui/material";
import { Edit } from "@mui/icons-material";
import { useSnackbar } from "notistack";
import { getAllUsers, updateUserTier } from "../../../../api/admin/users";
import { useDebounce } from "../../../../hooks/use-debounce";
import { CustomToolbar } from "../../../../components/DataGrid/CustomToolbar";
import { CustomFooter } from "../../../../components/DataGrid/CustomFooter";
import { CustomNoRowsOverlay } from "../../../../components/CustomNoRows";
import { localeText } from "../../../../constants/x-datagrid/localeText";
import { Loading } from "../../../../components/Loading";
import { ErrorUI } from "../../../../components/Error";
import useServerPagination from "../../../../hooks/admin/useServerPagination";
import useProcessingIds from "../../../../hooks/admin/useProcessingIds";
import FilterSelect from "../../../../components/FilterSelect";
import { formatShortDate } from "../../../../utils/date";
import { PRICE_TIERS, TIER_LABELS } from "../../../../constants/pricing";
import TierChangeDialog from "./TierChangeDialog";

const TIER_FILTER_OPTIONS = [
  { value: "", label: "Todos los tipos" },
  ...PRICE_TIERS.map((t) => ({ value: t, label: `${t} — ${TIER_LABELS[t]}` })),
];

const getColumns = (onEdit, processingIds) => [
  {
    field: "fullName",
    headerName: "Nombre",
    width: 190,
    valueGetter: (_, row) => `${row.firstName ?? ""} ${row.lastName ?? ""}`.trim() || "—",
  },
  { field: "email", headerName: "Email", width: 230 },
  {
    field: "priceTier",
    headerName: "Tipo de cliente",
    width: 200,
    renderCell: ({ row }) => {
      const tier = row.priceTier || "A";
      return (
        <Button
          size="small"
          variant="outlined"
          color="inherit"
          endIcon={<Edit sx={{ fontSize: 16 }} />}
          disabled={processingIds.has(row.id)}
          onClick={() => onEdit(row)}
          sx={{ textTransform: "none", fontWeight: 600 }}
        >
          {tier} · {TIER_LABELS[tier]}
        </Button>
      );
    },
  },
  { field: "companyName", headerName: "Empresa", width: 170, valueFormatter: (v) => v || "—" },
  { field: "phoneNumber", headerName: "Teléfono", width: 140, valueFormatter: (v) => v || "—" },
  {
    field: "role",
    headerName: "Rol",
    width: 120,
    valueGetter: (_, row) => row.Role?.name || "—",
    renderCell: ({ value }) => <Chip label={value} size="small" variant="outlined" />,
  },
  {
    field: "createdAt",
    headerName: "Alta",
    width: 130,
    valueFormatter: (v) => formatShortDate(v),
  },
];

const Clients = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [search, setSearch] = useState("");
  const [tier, setTier] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const { processingIds, addProcessing, removeProcessing } = useProcessingIds();
  const [editingClient, setEditingClient] = useState(null);

  const fetchUsers = useCallback(
    (page, size) =>
      getAllUsers(page, size, {
        search: debouncedSearch || undefined,
        tier: tier || undefined,
        role: "user",
      }),
    [debouncedSearch, tier]
  );

  const { data, loading, error, paginationModel, setPaginationModel, reload, updateRow } =
    useServerPagination(fetchUsers, { rowsKey: "users" });

  // Reset a página 1 cuando cambian los filtros (solo si no estamos ya en la 1)
  useEffect(() => {
    setPaginationModel((prev) => (prev.page === 0 ? prev : { ...prev, page: 0 }));
  }, [debouncedSearch, tier, setPaginationModel]);

  const handleTierChange = useCallback(
    async (row, newTier) => {
      const prevTier = row.priceTier;
      if (newTier === prevTier) return;

      updateRow(row.id, { priceTier: newTier });
      addProcessing(row.id);

      try {
        await updateUserTier(row.id, newTier);
        enqueueSnackbar(`${row.email} → tipo ${newTier}`, { variant: "success" });
      } catch (err) {
        updateRow(row.id, { priceTier: prevTier });
        enqueueSnackbar(err?.message || "Error al actualizar el tipo de cliente", {
          variant: "error",
        });
      } finally {
        removeProcessing(row.id);
      }
    },
    [enqueueSnackbar, updateRow, addProcessing, removeProcessing]
  );

  const handleEdit = useCallback((row) => setEditingClient(row), []);

  if (loading && !data) return <Loading />;
  if (error) return <ErrorUI onRetry={reload} message="No pudimos cargar los clientes" />;

  return (
    <Stack spacing={2}>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <TextField
          label="Buscar por nombre, email o empresa"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          size="small"
          fullWidth
        />
        <FilterSelect value={tier} onChange={setTier} options={TIER_FILTER_OPTIONS} />
      </Stack>

      <DataGrid
        localeText={localeText}
        rows={data?.users || []}
        columns={getColumns(handleEdit, processingIds)}
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
          toolbar: CustomToolbar,
          noRowsOverlay: CustomNoRowsOverlay,
          footer: CustomFooter,
        }}
        slotProps={{ noRowsOverlay: { message: "Aún no hay clientes" } }}
      />

      <TierChangeDialog
        open={Boolean(editingClient)}
        client={editingClient}
        onClose={() => setEditingClient(null)}
        onConfirm={(newTier) => handleTierChange(editingClient, newTier)}
      />
    </Stack>
  );
};

export default Clients;
