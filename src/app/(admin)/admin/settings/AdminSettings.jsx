"use client";

import { useCallback, useEffect, useState } from "react";
import { Alert, Box, TextField, Typography, Stack } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useSnackbar } from "notistack";
import { getSettings, updateSetting } from "../../../../api/admin/settings";
import { Loading } from "../../../../components/Loading";
import { ErrorUI } from "../../../../components/Error";

const ExampleRow = ({ icon, text }) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 1, py: 0.25 }}>
    <Typography variant="caption" sx={{ flexShrink: 0 }}>
      {icon}
    </Typography>
    <Typography variant="caption" color="text.secondary">
      {text}
    </Typography>
  </Box>
);

const WholesaleConfigHint = ({ minTotal, minSameProduct }) => {
  const mt = Number(minTotal) || 0;
  const msp = Number(minSameProduct) || 0;

  if (mt === 0 && msp === 0) {
    return (
      <Alert severity="info" sx={{ py: 0.5 }}>
        <Typography variant="caption">
          Mayoreo desactivado. Los clientes siempre pagarán precio de menudeo.
        </Typography>
      </Alert>
    );
  }

  const examples = [];

  if (msp > 0) {
    examples.push({ icon: "✅", text: `${msp} del mismo producto → mayoreo en ese producto` });
    examples.push({ icon: "❌", text: `${msp - 1} del mismo producto → menudeo` });
  }

  if (mt > 0) {
    examples.push({ icon: "✅", text: `${mt} artículos variados → todo mayoreo` });
    examples.push({ icon: "❌", text: `${mt - 1} artículos variados → todo menudeo` });
  }

  if (mt > 0 && msp > 0) {
    const mixA = msp;
    const mixB = Math.max(1, msp - 2);
    const mixTotal = mixA + mixB;
    if (mixTotal < mt) {
      examples.push({
        icon: "⚠️",
        text: `${mixA} de A + ${mixB} de B = ${mixTotal} total → A mayoreo, B menudeo`,
      });
    }
  }

  const isRecommended = mt > 0 && msp > 0 && mt === msp * 2;
  const needsAdjust = mt > 0 && msp > 0 && mt !== msp * 2;

  return (
    <Box
      sx={{
        p: 2,
        bgcolor: "grey.50",
        borderRadius: 2,
        border: "1px solid",
        borderColor: isRecommended ? "success.light" : needsAdjust ? "warning.light" : "grey.300",
      }}
    >
      <Typography variant="caption" fontWeight={700} display="block" sx={{ mb: 1 }}>
        Vista previa con tus valores ({mt} total, {msp} por producto):
      </Typography>
      <Stack spacing={0}>
        {examples.map((ex, i) => (
          <ExampleRow key={i} icon={ex.icon} text={ex.text} />
        ))}
      </Stack>
      {isRecommended && (
        <Typography variant="caption" color="success.main" display="block" sx={{ mt: 1 }}>
          Configuración recomendada — las reglas se complementan sin solaparse.
        </Typography>
      )}
      {needsAdjust && (
        <Typography variant="caption" color="warning.main" display="block" sx={{ mt: 1 }}>
          Recomendación: usar {msp * 2} como mínimo total para complementar el mínimo por producto
          de {msp}.
        </Typography>
      )}
    </Box>
  );
};

const AdminSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(false);
  const [minTotal, setMinTotal] = useState("");
  const [minSameProduct, setMinSameProduct] = useState("");
  const { enqueueSnackbar } = useSnackbar();

  const loadSettings = useCallback(async () => {
    setError(false);
    setLoading(true);
    try {
      const data = await getSettings();
      const mt = data.find((s) => s.key === "WHOLESALE_MIN_TOTAL");
      const msp = data.find((s) => s.key === "WHOLESALE_MIN_SAME_PRODUCT");
      if (mt) setMinTotal(mt.value);
      if (msp) setMinSameProduct(msp.value);
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
      await updateSetting("WHOLESALE_MIN_TOTAL", minTotal);
      await updateSetting("WHOLESALE_MIN_SAME_PRODUCT", minSameProduct);
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
            Mínimo total del carrito para mayoreo
          </Typography>
          <TextField
            value={minTotal}
            onChange={(e) => setMinTotal(e.target.value)}
            type="number"
            fullWidth
            inputProps={{ min: 0, step: 1 }}
          />
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block" }}>
            Si el carrito tiene esta cantidad o más de artículos, todas las líneas aplican mayoreo.
            Usar 0 para desactivar.
          </Typography>
        </Box>
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Mínimo por producto para mayoreo
          </Typography>
          <TextField
            value={minSameProduct}
            onChange={(e) => setMinSameProduct(e.target.value)}
            type="number"
            fullWidth
            inputProps={{ min: 0, step: 1 }}
          />
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block" }}>
            Si un producto tiene esta cantidad o más, esa línea aplica mayoreo aunque el total del
            carrito no alcance. Usar 0 para desactivar.
          </Typography>
        </Box>
        <WholesaleConfigHint minTotal={minTotal} minSameProduct={minSameProduct} />
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
