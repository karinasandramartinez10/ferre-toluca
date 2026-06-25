"use client";

import { useEffect, useState } from "react";
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
import PromotionScopePicker from "./PromotionScopePicker";
import PromotionFields from "./PromotionFields";
import { buildPromotionBody } from "./buildPromotionBody";

const buildDefaults = () => {
  const now = new Date();
  return {
    name: "",
    type: "percentage",
    scopeKind: "brand",
    scopeOption: null,
    month: now.getMonth(),
    year: now.getFullYear(),
    active: true,
    discountPercentage: null,
    buyQuantity: null,
    receiveTotal: null,
    getDiscountPercentage: 100,
  };
};

const PromotionModal = ({ open, onClose, promotion, onSaved }) => {
  const isEdit = !!promotion;
  const { enqueueSnackbar } = useSnackbar();
  const { getScopeLabel } = usePromotionScopeOptions();
  const [submitting, setSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(promotionSchema),
    mode: "onChange",
    defaultValues: buildDefaults(),
  });

  const type = watch("type");
  const scopeKind = watch("scopeKind");
  const scopeOption = watch("scopeOption");

  useEffect(() => {
    if (!open) return;
    if (promotion) {
      const scope = getPromotionScope(promotion);
      const starts = parseISO(promotion.startsAt);
      reset({
        name: promotion.name,
        type: promotion.type,
        scopeKind: scope.kind,
        scopeOption: { id: scope.id, label: getScopeLabel(scope.kind, scope.id) },
        month: starts.getMonth(),
        year: starts.getFullYear(),
        active: promotion.active,
        discountPercentage: promotion.discountPercentage,
        buyQuantity: promotion.buyQuantity,
        receiveTotal:
          promotion.buyQuantity != null && promotion.getQuantity != null
            ? promotion.buyQuantity + promotion.getQuantity
            : null,
        getDiscountPercentage: promotion.getDiscountPercentage,
      });
    } else {
      reset(buildDefaults());
    }
  }, [open, promotion, reset, getScopeLabel]);

  const onSubmit = async (values) => {
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
            error={errors.scopeOption?.message}
            onKindChange={(kind) => {
              setValue("scopeKind", kind, { shouldValidate: true });
              setValue("scopeOption", null, { shouldValidate: true });
            }}
            onOptionChange={(value) => setValue("scopeOption", value, { shouldValidate: true })}
          />
          <PromotionFields control={control} errors={errors} type={type} typeDisabled={isEdit} />
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
