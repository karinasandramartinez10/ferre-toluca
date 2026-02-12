"use client";

import {
  Box,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { FiscalProfileSchema } from "../../../../../schemas/user/fiscal";
import { useFiscalCatalogs } from "../../../../../hooks/user/fiscal/useFiscalCatalogs";
import { useUserFiscals } from "../../../../../hooks/user/fiscal/useUserFiscals";
import { useFiscalMutations } from "../../../../../hooks/user/fiscal/useFiscalMutations";
import { adaptFiscalDomainToForm } from "./adapters";
import { Loading } from "../../../../../components/Loading";
import { ErrorUI } from "../../../../../components/Error";
import FiscalCard from "./FiscalCard";
import DeleteConfirmDialog from "./DeleteConfirmDialog";
import FiscalForm from "./FiscalForm";
import { getDefaultFiscalProfile } from "../../../../../utils/fiscal";

export default function FiscalProfilePage() {
  const { enqueueSnackbar } = useSnackbar();
  const {
    taxRegimes,
    cfdiUses,
    loading: loadingCats,
    error: errorCats,
  } = useFiscalCatalogs();
  const {
    profiles,
    loading: loadingList,
    error: errorList,
  } = useUserFiscals();
  const {
    create,
    update,
    setDefault,
    remove,
    loading: mutating,
  } = useFiscalMutations();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const loading = loadingCats || loadingList;
  const error = errorCats || errorList;

  const handleCreate = () => {
    setEditing(null);
    setOpen(true);
  };
  const handleEdit = (profile) => {
    setEditing(profile);
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const onSubmit = async (values) => {
    try {
      if (editing) {
        await update(editing.id, values);
        enqueueSnackbar("Registro actualizado", { variant: "success" });
      } else {
        await create(values, "id");
        enqueueSnackbar("Registro creado", { variant: "success" });
      }
      setOpen(false);
    } catch (e) {
      enqueueSnackbar(e.message || "Error al guardar", { variant: "error" });
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await setDefault(id);
      enqueueSnackbar("Registro marcado como predeterminado", {
        variant: "success",
      });
    } catch (e) {
      enqueueSnackbar(e.message || "No se pudo actualizar el predeterminado", {
        variant: "error",
      });
    }
  };

  const handleDelete = (profile) => {
    setDeleteTarget(profile);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await remove(deleteTarget.id);
      enqueueSnackbar("Registro eliminado", { variant: "success" });
      setDeleteTarget(null);
    } catch (e) {
      enqueueSnackbar(e.message || "No se pudo eliminar", { variant: "error" });
    }
  };

  if (loading) return <Loading />;
  if (error) return <ErrorUI />;

  const chosenDefault = getDefaultFiscalProfile(profiles);
  const chosenDefaultId = chosenDefault?.id ?? null;

  return (
    <Box>
      <Box display="flex" justifyContent="flex-start" mb={2}>
        <Button variant="contained" onClick={handleCreate}>
          Nuevo registro
        </Button>
      </Box>
      {profiles?.length === 0 ? (
        <Box textAlign="center" py={8}>
          <Typography variant="h6" gutterBottom>
            No tienes registros de facturación
          </Typography>
          <Button variant="contained" onClick={handleCreate}>
            Crear primer registro
          </Button>
        </Box>
      ) : (
        <Grid container spacing={2}>
          {profiles.map((p) => (
            <Grid item xs={12} md={6} lg={4} key={p.id}>
              <FiscalCard
                profile={p}
                isDefault={p.id === chosenDefaultId}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onSetDefault={handleSetDefault}
                disableDelete={p.id === chosenDefaultId && profiles.length > 1}
              />
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle>
          {editing ? "Editar datos de facturación" : "Nuevos datos de facturación"}
        </DialogTitle>
        <DialogContent sx={{ paddingTop: "16px !important" }}>
          <FiscalForm
            key={editing ? `edit-${editing.id}` : "new"}
            defaults={
              editing
                ? adaptFiscalDomainToForm(editing)
                : {
                    fiscalName: "",
                    rfc: "",
                    taxZipCode: "",
                    taxRegimeId: null,
                    taxRegimeCode: "",
                    defaultCfdiUseId: null,
                    cfdiUseCode: "",
                    isDefault: profiles.length === 0,
                  }
            }
            schema={FiscalProfileSchema}
            taxRegimes={taxRegimes}
            cfdiUses={cfdiUses}
            onSubmit={onSubmit}
            submitting={mutating}
            onCancel={handleClose}
            hideIsDefault={Boolean(editing)}
          />
        </DialogContent>
      </Dialog>

      <DeleteConfirmDialog
        open={Boolean(deleteTarget)}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title="Eliminar datos de facturación"
        description={
          <>
            ¿Estás seguro de eliminar el registro{" "}
            <strong>{deleteTarget?.fiscalName}</strong>? Esta acción no se puede
            deshacer.
          </>
        }
        warning={
          profiles.length === 1 ? (
            <Typography sx={{ mt: 1 }} color="error">
              Son tus únicos datos de facturación. Al eliminarlos, no tendrás
              datos predeterminados hasta crear otros.
            </Typography>
          ) : null
        }
      />
    </Box>
  );
}
