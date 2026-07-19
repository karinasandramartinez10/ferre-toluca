"use client";

import { useEffect, useRef, useState } from "react";
import {
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
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSnackbar } from "notistack";
import { createPromotion } from "../../../../api/promotions";
import { getApiErrorMessage } from "../../../../utils/apiError";
import { promotionValueSchema } from "../../../../schemas/promotion";
import { SCOPE_KIND_LABELS } from "../../../../constants/promotions";
import type { ScopeSelection } from "../../../../types/promotion";
import PromotionFields from "./PromotionFields";
import { buildPromotionBody } from "./buildPromotionBody";

interface PromotionComposerProps {
  open: boolean;
  onClose: () => void;
  scopes?: ScopeSelection[];
  onSaved: () => void;
}

const buildDefaults = () => {
  const now = new Date();
  return {
    name: "",
    type: "percentage",
    applicableTiers: [],
    month: now.getMonth(),
    year: now.getFullYear(),
    active: true,
    discountPercentage: null,
    minQuantity: null,
    priceMode: "percentage",
    volumeDiscountPercentage: null,
    volumePriceA: null,
    volumePriceB: null,
    volumePriceC: null,
    volumePriceD: null,
  };
};

const PromotionComposer = ({ open, onClose, scopes = [], onSaved }: PromotionComposerProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const [submitting, setSubmitting] = useState(false);
  const submittingRef = useRef(false);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isValid },
  } = useForm<any>({
    resolver: yupResolver(promotionValueSchema),
    mode: "onChange",
    defaultValues: buildDefaults(),
  });

  const type = watch("type");
  const priceMode = watch("priceMode");
  const applicableTiers = watch("applicableTiers");
  // Modo absoluto solo si la selección es exactamente un producto.
  const scopeProductId = scopes.length === 1 && scopes[0].kind === "product" ? scopes[0].id : null;

  useEffect(() => {
    if (open) reset(buildDefaults());
  }, [open, reset]);

  const onSubmit = async (values) => {
    if (submittingRef.current) return;
    submittingRef.current = true;
    setSubmitting(true);
    try {
      const results = await Promise.allSettled(
        scopes.map((scope) =>
          createPromotion(
            buildPromotionBody({ ...values, scopeKind: scope.kind, scopeOption: { id: scope.id } })
          )
        )
      );
      const created = results.filter((r) => r.status === "fulfilled").length;
      const failed = results.length - created;

      if (created) {
        enqueueSnackbar(
          `${created} promoción${created > 1 ? "es" : ""} creada${created > 1 ? "s" : ""}`,
          {
            variant: "success",
          }
        );
      }
      if (failed) {
        const firstError = results.find((r) => r.status === "rejected");
        enqueueSnackbar(`${failed} no se pudo crear: ${getApiErrorMessage(firstError?.reason)}`, {
          variant: "error",
        });
      }
      if (created) {
        onSaved();
        onClose();
      }
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 600 }}>Nueva promoción</DialogTitle>
      <DialogContent>
        <Typography variant="caption" color="text.secondary">
          Se creará una promoción por cada alcance seleccionado.
        </Typography>

        <Stack direction="row" sx={{ flexWrap: "wrap", gap: 0.5, mt: 1, mb: 2 }}>
          {scopes.map((scope) => (
            <Chip
              key={`${scope.kind}:${scope.id}`}
              size="small"
              color="secondary"
              label={`${SCOPE_KIND_LABELS[scope.kind]}: ${scope.label}`}
            />
          ))}
        </Stack>

        <Stack spacing={2}>
          <PromotionFields
            control={control}
            errors={errors}
            type={type}
            priceMode={priceMode}
            applicableTiers={applicableTiers}
            scopeProductId={scopeProductId}
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} variant="text" color="inherit" disabled={submitting}>
          Cancelar
        </Button>
        <LoadingButton
          onClick={handleSubmit(onSubmit)}
          loading={submitting}
          disabled={!isValid || scopes.length === 0}
          variant="contained"
        >
          Crear{scopes.length > 1 ? ` (${scopes.length})` : ""}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default PromotionComposer;
