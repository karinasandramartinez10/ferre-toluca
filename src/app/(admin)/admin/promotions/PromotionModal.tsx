"use client";

import { useEffect, useRef, useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSnackbar } from "notistack";
import { parseISO } from "date-fns";
import { createPromotion, updatePromotion } from "../../../../api/promotions";
import { getApiErrorMessage } from "../../../../utils/apiError";
import { promotionSchema } from "../../../../schemas/promotion";
import usePromotionScopeOptions from "../../../../hooks/admin/usePromotionScopeOptions";
import { getPromotionScope } from "../../../../constants/promotions";
import type { Promotion, PromotionScopeType } from "../../../../types/promotion";
import PromotionScopePicker from "./PromotionScopePicker";
import PromotionFields from "./PromotionFields";
import { buildPromotionBody } from "./buildPromotionBody";

interface PromotionModalProps {
  open: boolean;
  onClose: () => void;
  promotion?: Promotion | null;
  onSaved: () => void;
}

const buildDefaults = () => {
  const now = new Date();
  return {
    name: "",
    type: "percentage",
    applicableTiers: [],
    scopeKind: "brand",
    scopeOption: null,
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

const PromotionModal = ({ open, onClose, promotion, onSaved }: PromotionModalProps) => {
  const isEdit = !!promotion;
  const { enqueueSnackbar } = useSnackbar();
  const { getScopeLabel } = usePromotionScopeOptions();
  const [submitting, setSubmitting] = useState(false);
  const submittingRef = useRef(false);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<any>({
    resolver: yupResolver(promotionSchema),
    mode: "onChange",
    defaultValues: buildDefaults(),
  });

  const type = watch("type");
  const priceMode = watch("priceMode");
  const applicableTiers = watch("applicableTiers");
  const scopeKind = watch("scopeKind");
  const scopeOption = watch("scopeOption");
  const scopeProductId = scopeKind === "product" ? (scopeOption?.id ?? null) : null;

  useEffect(() => {
    if (!open) return;
    if (promotion) {
      const scope = getPromotionScope(promotion);
      const scopeKind = scope.kind as PromotionScopeType;
      const starts = parseISO(promotion.startsAt);
      reset({
        name: promotion.name,
        type: promotion.type,
        scopeKind,
        scopeOption: { id: scope.id, label: getScopeLabel(scopeKind, scope.id) },
        applicableTiers: promotion.applicableTiers ?? [],
        month: starts.getMonth(),
        year: starts.getFullYear(),
        active: promotion.active,
        discountPercentage: promotion.discountPercentage,
        minQuantity: promotion.minQuantity,
        priceMode: promotion.priceMode ?? "percentage",
        volumeDiscountPercentage: promotion.volumeDiscountPercentage,
        volumePriceA: promotion.volumePriceA,
        volumePriceB: promotion.volumePriceB,
        volumePriceC: promotion.volumePriceC,
        volumePriceD: promotion.volumePriceD,
      });
    } else {
      reset(buildDefaults());
    }
  }, [open, promotion, reset, getScopeLabel]);

  useEffect(() => {
    if (!scopeProductId && priceMode === "absolute") {
      setValue("priceMode", "percentage");
    }
  }, [scopeProductId, priceMode, setValue]);

  const onSubmit = async (values) => {
    if (submittingRef.current) return;
    submittingRef.current = true;
    setSubmitting(true);
    try {
      if (isEdit) await updatePromotion(promotion.id, buildPromotionBody(values, true));
      else await createPromotion(buildPromotionBody(values));
      enqueueSnackbar(isEdit ? "Promoción actualizada" : "Promoción creada", {
        variant: "success",
      });
      onSaved();
      onClose();
    } catch (error) {
      enqueueSnackbar(getApiErrorMessage(error), { variant: "error" });
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 600 }}>
        {isEdit ? "Editar promoción" : "Crear promoción"}
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          <PromotionScopePicker
            scopeKind={scopeKind}
            scopeOption={scopeOption}
            disabled={isEdit}
            error={errors.scopeOption?.message as string}
            onKindChange={(kind) => {
              setValue("scopeKind", kind, { shouldValidate: true });
              setValue("scopeOption", null, { shouldValidate: true });
            }}
            onOptionChange={(value) => setValue("scopeOption", value, { shouldValidate: true })}
          />
          <PromotionFields
            control={control}
            errors={errors}
            type={type}
            priceMode={priceMode}
            applicableTiers={applicableTiers}
            scopeProductId={scopeProductId}
            typeDisabled={isEdit}
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
          disabled={!isValid}
          variant="contained"
        >
          {isEdit ? "Guardar" : "Crear promoción"}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default PromotionModal;
