import { startOfMonth, endOfMonth } from "date-fns";
import { SCOPE_BODY_FIELD } from "../../../../constants/promotions";

const valueFieldsOf = (values) =>
  values.type === "percentage"
    ? { discountPercentage: values.discountPercentage }
    : {
        buyQuantity: values.buyQuantity,
        // getQuantity = unidades de regalo = (recibe total) − (paga).
        getQuantity: values.receiveTotal - values.buyQuantity,
        getDiscountPercentage: values.getDiscountPercentage,
      };

export const buildPromotionBody = (values, isEdit = false) => {
  const startsAt = startOfMonth(new Date(values.year, values.month)).toISOString();
  const endsAt = endOfMonth(new Date(values.year, values.month)).toISOString();

  // En PATCH, type y ámbito son inmutables (el BE rechaza si van presentes).
  if (isEdit) {
    return {
      name: values.name.trim(),
      startsAt,
      endsAt,
      active: values.active,
      ...valueFieldsOf(values),
    };
  }

  return {
    name: values.name.trim(),
    type: values.type,
    [SCOPE_BODY_FIELD[values.scopeKind]]: values.scopeOption.id,
    startsAt,
    endsAt,
    active: values.active,
    ...valueFieldsOf(values),
  };
};
