"use client";

import { useCallback, useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Chip, CircularProgress, MenuItem, Select, Stack, TextField } from "@mui/material";
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
import { PRICE_TIERS, TIER_LABELS } from "../../../../constants/pricing";

const getColumns = (onTierChange, processingIds) => [
  {
    field: "fullName",
    headerName: "Nombre",
    width: 190,
    valueGetter: (_, row) => `${row.firstName ?? ""} ${row.lastName ?? ""}`.trim() || "—",
  },
  { field: "email", headerName: "Email", width: 230 },
  { field: "companyName", headerName: "Empresa", width: 170, valueFormatter: (v) => v || "—" },
  { field: "phoneNumber", headerName: "Teléfono", width: 140, valueFormatter: (v) => v || "—" },
  {
    field: "priceTier",
    headerName: "Tipo de cliente",
    width: 200,
    renderCell: ({ row }) => {
      const isProcessing = processingIds.has(row.id);
      return (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {isProcessing && <CircularProgress size={16} />}
          <Select
            value={row.priceTier || "A"}
            size="small"
            disabled={isProcessing}
            onChange={(e) => onTierChange(row, e.target.value)}
            sx={{
              minWidth: 150,
              "& .MuiOutlinedInput-notchedOutline": { border: "none" },
            }}
          >
            {PRICE_TIERS.map((t) => (
              <MenuItem key={t} value={t}>
                {`${t} — ${TIER_LABELS[t]}`}
              </MenuItem>
            ))}
          </Select>
        </Box>
      );
    },
  },
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
    valueFormatter: (v) => (v ? new Date(v).toLocaleDateString("es-MX") : "—"),
  },
];

const Clients = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [search, setSearch] = useState("");
  const [tier, setTier] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [processingIds, setProcessingIds] = useState(new Set());

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

  const addProcessing = (id) => setProcessingIds((prev) => new Set(prev).add(id));
  const removeProcessing = (id) =>
    setProcessingIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });

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
    [enqueueSnackbar, updateRow]
  );

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
        <Select
          value={tier}
          size="small"
          displayEmpty
          onChange={(e) => setTier(e.target.value)}
          sx={{ minWidth: 180 }}
        >
          <MenuItem value="">Todos los tipos</MenuItem>
          {PRICE_TIERS.map((t) => (
            <MenuItem key={t} value={t}>
              {`${t} — ${TIER_LABELS[t]}`}
            </MenuItem>
          ))}
        </Select>
      </Stack>

      <DataGrid
        localeText={localeText}
        rows={data?.users || []}
        columns={getColumns(handleTierChange, processingIds)}
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
      />
    </Stack>
  );
};

export default Clients;
