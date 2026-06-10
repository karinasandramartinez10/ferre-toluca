"use client";

import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { PRICE_TIERS, TIER_LABELS } from "../../../../constants/pricing";

const clientName = (client) =>
  client ? `${client.firstName ?? ""} ${client.lastName ?? ""}`.trim() || client.email : "";

const TierChangeDialog = ({ open, client, onClose, onConfirm }) => {
  const currentTier = client?.priceTier || "A";
  const [selected, setSelected] = useState(currentTier);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) setSelected(client?.priceTier || "A");
  }, [open, client]);

  const name = clientName(client);
  const changed = selected !== currentTier;

  const handleConfirm = async () => {
    setSubmitting(true);
    try {
      await onConfirm(selected);
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ fontWeight: 600 }}>Cambiar tipo de cliente</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          <Typography variant="body2" color="text.secondary">
            {name} · actualmente{" "}
            <Typography component="span" fontWeight={700} color="text.primary">
              {currentTier} · {TIER_LABELS[currentTier]}
            </Typography>
          </Typography>

          <ToggleButtonGroup
            exclusive
            fullWidth
            value={selected}
            onChange={(_, t) => t && setSelected(t)}
          >
            {PRICE_TIERS.map((t) => (
              <ToggleButton key={t} value={t} sx={{ flexDirection: "column", py: 1, gap: 0.25 }}>
                <Typography variant="subtitle2" fontWeight={700} lineHeight={1}>
                  {t}
                </Typography>
                <Typography variant="caption" color="text.secondary" lineHeight={1}>
                  {TIER_LABELS[t]}
                </Typography>
              </ToggleButton>
            ))}
          </ToggleButtonGroup>

          {changed && (
            <Alert severity="warning">
              {name} verá <b>todos los productos</b> con el precio del tipo{" "}
              <b>
                {selected} · {TIER_LABELS[selected]}
              </b>
              .
            </Alert>
          )}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} variant="text" color="inherit" disabled={submitting}>
          Cancelar
        </Button>
        <LoadingButton
          onClick={handleConfirm}
          loading={submitting}
          disabled={!changed}
          variant="contained"
        >
          Confirmar cambio
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default TierChangeDialog;
