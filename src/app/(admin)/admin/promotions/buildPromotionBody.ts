import { startOfMonth, endOfMonth } from "date-fns";
import { SCOPE_BODY_FIELD } from "../../../../constants/promotions";
import { PRICE_TIERS } from "../../../../constants/pricing";
import type { PromotionFormValues } from "../../../../types/promotion";

const valueFieldsOf = (values: PromotionFormValues) => {
  if (values.type === "percentage") {
    return { discountPercentage: values.discountPercentage };
  }
  const base = { minQuantity: values.minQuantity, priceMode: values.priceMode };
  if (values.priceMode === "absolute") {
    // Precio por tier solo para los tiers aplicables (o los 4 si aplica a todos).
    const tiers = values.applicableTiers?.length ? values.applicableTiers : PRICE_TIERS;
    const prices: Record<string, unknown> = {};
    const raw = values as unknown as Record<string, unknown>;
    tiers.forEach((tier) => {
      prices[`volumePrice${tier}`] = raw[`volumePrice${tier}`];
    });
    return { ...base, ...prices };
  }
  return { ...base, volumeDiscountPercentage: values.volumeDiscountPercentage };
};

export const buildPromotionBody = (
  values: PromotionFormValues,
  isEdit = false
): Record<string, unknown> => {
  const startsAt = startOfMonth(new Date(values.year, values.month)).toISOString();
  const endsAt = endOfMonth(new Date(values.year, values.month)).toISOString();
  // Vacío = null = todos los tiers.
  const applicableTiers = values.applicableTiers?.length ? values.applicableTiers : null;

  // En PATCH, type y ámbito son inmutables (el BE rechaza si van presentes).
  if (isEdit) {
    return {
      name: values.name.trim(),
      applicableTiers,
      startsAt,
      endsAt,
      active: values.active,
      ...valueFieldsOf(values),
    };
  }

  return {
    name: values.name.trim(),
    type: values.type,
    applicableTiers,
    [SCOPE_BODY_FIELD[values.scopeKind]]: values.scopeOption.id,
    startsAt,
    endsAt,
    active: values.active,
    ...valueFieldsOf(values),
  };
};
