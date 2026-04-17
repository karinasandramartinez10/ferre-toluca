"use client";

import { useCallback, useEffect, useState } from "react";
import { Box, TextField, Typography, Stack } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useSnackbar } from "notistack";
import { getSettings, updateSetting } from "../../../../api/admin/settings";
import { Loading } from "../../../../components/Loading";
import { ErrorUI } from "../../../../components/Error";

const AdminSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(false);
  const [wholesaleMin, setWholesaleMin] = useState("");
  const { enqueueSnackbar } = useSnackbar();

  const loadSettings = useCallback(async () => {
    setError(false);
    setLoading(true);
    try {
      const data = await getSettings();
      const wm = data.find((s) => s.key === "WHOLESALE_MIN_QUANTITY");
      if (wm) setWholesaleMin(wm.value);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateSetting("WHOLESALE_MIN_QUANTITY", wholesaleMin);
      enqueueSnackbar("Configuración actualizada", { variant: "success" });
    } catch {
      enqueueSnackbar("Error al actualizar configuración", { variant: "error" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading />;
  if (error) return <ErrorUI onRetry={loadSettings} message="No pudimos cargar la configuración" />;

  return (
    <Box sx={{ maxWidth: 500 }}>
      <Stack spacing={3}>
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Cantidad mínima de piezas para compra mayoreo
          </Typography>
          <TextField
            value={wholesaleMin}
            onChange={(e) => setWholesaleMin(e.target.value)}
            type="number"
            fullWidth
            inputProps={{ min: 0, step: 1 }}
          />
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block" }}>
            Si una cotización en modo mayoreo no alcanza esta cantidad de piezas, será rechazada.
            Usar 0 para sin mínimo.
          </Typography>
        </Box>
        <LoadingButton
          variant="contained"
          onClick={handleSave}
          loading={saving}
          sx={{ alignSelf: "flex-start" }}
        >
          Guardar
        </LoadingButton>
      </Stack>
    </Box>
  );
};

export default AdminSettings;
