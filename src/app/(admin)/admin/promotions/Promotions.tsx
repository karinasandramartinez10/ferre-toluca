"use client";

import { useCallback, useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Stack } from "@mui/material";
import { useSnackbar } from "notistack";
import { getPromotions, deletePromotion } from "../../../../api/promotions";
import { CustomToolbar } from "../../../../components/DataGrid/CustomToolbar";
import { CustomFooter } from "../../../../components/DataGrid/CustomFooter";
import { CustomNoRowsOverlay } from "../../../../components/CustomNoRows";
import DeleteConfirmationDialog from "../../../../components/DeleteConfirmationDialog";
import { localeText } from "../../../../constants/x-datagrid/localeText";
import { Loading } from "../../../../components/Loading";
import { ErrorUI } from "../../../../components/Error";
import FilterSelect from "../../../../components/FilterSelect";
import useServerPagination from "../../../../hooks/admin/useServerPagination";
import usePromotionScopeOptions from "../../../../hooks/admin/usePromotionScopeOptions";
import { PROMOTION_TYPE_OPTIONS } from "../../../../constants/promotions";
import type { Promotion } from "../../../../types/promotion";
import PromotionModal from "./PromotionModal";
import { getPromotionColumns } from "./promotionColumns";

const STATUS_FILTERS = [
  { value: "", label: "Todos los estados" },
  { value: "active", label: "Activas" },
  { value: "scheduled", label: "Programadas" },
  { value: "expired", label: "Expiradas" },
  { value: "inactive", label: "Inactivas" },
];

const TYPE_FILTERS = [{ value: "", label: "Todos los tipos" }, ...PROMOTION_TYPE_OPTIONS];

const Promotions = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { getScopeLabel } = usePromotionScopeOptions();
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Promotion | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Promotion | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchPromotions = useCallback(
    (page: number, size: number) => {
      // `status` (active|scheduled|expired) y `active` son filtros independientes en el BE;
      // "inactive" no es un status filtrable → se pide con active=false.
      const filters: Record<string, unknown> = { type: typeFilter || undefined };
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

  const openEdit = (promotion: Promotion) => {
    setEditing(promotion);
    setModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
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
        columns={getPromotionColumns({
          getScopeLabel,
          onEdit: openEdit,
          onDelete: setDeleteTarget,
        })}
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
          toolbar: CustomToolbar as any,
          noRowsOverlay: CustomNoRowsOverlay as any,
          footer: CustomFooter as any,
        }}
        slotProps={{ noRowsOverlay: { message: "Aún no hay promociones" } as any }}
      />

      <PromotionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        promotion={editing}
        onSaved={reload}
      />

      <DeleteConfirmationDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        confirmColor="error"
        title="Eliminar promoción"
        description={
          deleteTarget
            ? `¿Seguro que quieres eliminar "${deleteTarget.name}"? Esta acción no se puede deshacer.`
            : ""
        }
      />
    </>
  );
};

export default Promotions;
