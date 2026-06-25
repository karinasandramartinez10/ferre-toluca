"use client";

import { useCallback, useEffect, useState } from "react";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import { Edit, Delete } from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useSnackbar } from "notistack";
import { getPromotions, deletePromotion } from "../../../../api/promotions";
import { CustomToolbar } from "../../../../components/DataGrid/CustomToolbar";
import { CustomFooter } from "../../../../components/DataGrid/CustomFooter";
import { CustomNoRowsOverlay } from "../../../../components/CustomNoRows";
import { localeText } from "../../../../constants/x-datagrid/localeText";
import { Loading } from "../../../../components/Loading";
import { ErrorUI } from "../../../../components/Error";
import FilterSelect from "../../../../components/FilterSelect";
import useServerPagination from "../../../../hooks/admin/useServerPagination";
import usePromotionScopeOptions from "../../../../hooks/admin/usePromotionScopeOptions";
import { formatShortDate } from "../../../../utils/date";
import {
  PROMOTION_STATUS_COLORS,
  PROMOTION_STATUS_LABELS,
  PROMOTION_TYPE_LABELS,
  PROMOTION_TYPE_OPTIONS,
  SCOPE_KIND_LABELS,
  getPromotionScope,
} from "../../../../constants/promotions";
import PromotionModal from "./PromotionModal";

const STATUS_FILTERS = [
  { value: "", label: "Todos los estados" },
  { value: "active", label: "Activas" },
  { value: "scheduled", label: "Programadas" },
  { value: "expired", label: "Expiradas" },
  { value: "inactive", label: "Inactivas" },
];

const TYPE_FILTERS = [{ value: "", label: "Todos los tipos" }, ...PROMOTION_TYPE_OPTIONS];

const getColumns = (getScopeLabel, onEdit, onDelete) => [
  { field: "name", headerName: "Nombre de la promoción", width: 200 },
  {
    field: "type",
    headerName: "Tipo",
    width: 130,
    renderCell: ({ value }) => (
      <Chip label={PROMOTION_TYPE_LABELS[value] || value} size="small" variant="outlined" />
    ),
  },
  {
    field: "discountPercentage",
    headerName: "Porcentaje de descuento",
    width: 150,
    renderCell: ({ value }) => <Chip label={`${value ?? "0"}%`} size="small" variant="outlined" />,
  },
  {
    field: "scope",
    headerName: "Ámbito",
    width: 240,
    sortable: false,
    renderCell: ({ row }) => {
      const scope = getPromotionScope(row);
      return (
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="caption" color="text.secondary" display="block">
            {SCOPE_KIND_LABELS[scope.kind]}
          </Typography>
          <Typography variant="body2" noWrap>
            {getScopeLabel(scope.kind, scope.id)}
          </Typography>
        </Box>
      );
    },
  },
  {
    field: "vigencia",
    headerName: "Vigencia",
    width: 190,
    sortable: false,
    renderCell: ({ row }) => `${formatShortDate(row.startsAt)} – ${formatShortDate(row.endsAt)}`,
  },
  {
    field: "status",
    headerName: "Estado",
    width: 130,
    renderCell: ({ value }) => (
      <Chip
        label={PROMOTION_STATUS_LABELS[value] || value}
        size="small"
        color={PROMOTION_STATUS_COLORS[value] || "default"}
      />
    ),
  },
  {
    field: "actions",
    type: "actions",
    headerName: "Acciones",
    width: 110,
    getActions: ({ row }) => [
      <GridActionsCellItem
        key={`edit-${row.id}`}
        icon={<Edit />}
        label="Editar"
        onClick={() => onEdit(row)}
      />,
      <GridActionsCellItem
        key={`delete-${row.id}`}
        icon={<Delete />}
        label="Borrar"
        color="error"
        onClick={() => onDelete(row)}
      />,
    ],
  },
];

const Promotions = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { getScopeLabel } = usePromotionScopeOptions();
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchPromotions = useCallback(
    (page, size) => {
      // `status` (active|scheduled|expired) y `active` son filtros independientes en el BE;
      // "inactive" no es un status filtrable → se pide con active=false.
      const filters = { type: typeFilter || undefined };
      if (statusFilter === "inactive") filters.active = false;
      else if (statusFilter) filters.status = statusFilter;
      return getPromotions(page, size, filters);
    },
    [statusFilter, typeFilter]
  );

  const { data, loading, error, paginationModel, setPaginationModel, reload } =
    useServerPagination(fetchPromotions);

  useEffect(() => {
    setPaginationModel((prev) => (prev.page === 0 ? prev : { ...prev, page: 0 }));
  }, [statusFilter, typeFilter, setPaginationModel]);

  const openEdit = (promotion) => {
    setEditing(promotion);
    setModalOpen(true);
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deletePromotion(deleteTarget.id);
      enqueueSnackbar("Promoción eliminada", { variant: "success" });
      setDeleteTarget(null);
      reload();
    } catch (err) {
      enqueueSnackbar(err?.message || "Error al eliminar la promoción", { variant: "error" });
    } finally {
      setDeleting(false);
    }
  };

  if (loading && !data) return <Loading />;
  if (error) return <ErrorUI onRetry={reload} message="No pudimos cargar las promociones" />;

  return (
    <>
      <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: "wrap", gap: 1 }}>
        <FilterSelect value={statusFilter} onChange={setStatusFilter} options={STATUS_FILTERS} />
        <FilterSelect value={typeFilter} onChange={setTypeFilter} options={TYPE_FILTERS} />
      </Stack>

      <DataGrid
        localeText={localeText}
        rows={data?.promotions || []}
        columns={getColumns(getScopeLabel, openEdit, setDeleteTarget)}
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
        slotProps={{ noRowsOverlay: { message: "Aún no hay promociones" } }}
      />

      <PromotionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        promotion={editing}
        onSaved={reload}
      />

      <Dialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 600 }}>Eliminar promoción</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            ¿Seguro que quieres eliminar <b>{deleteTarget?.name}</b>? Esta acción no se puede
            deshacer.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeleteTarget(null)} color="inherit" disabled={deleting}>
            Cancelar
          </Button>
          <LoadingButton
            onClick={handleDelete}
            loading={deleting}
            variant="contained"
            color="error"
          >
            Eliminar
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Promotions;
