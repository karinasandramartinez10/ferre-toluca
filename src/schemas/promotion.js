import * as yup from "yup";
import { PRICE_TIERS } from "../constants/pricing";

const percentageField = (label, whenType) =>
  yup
    .number()
    .nullable()
    .when("type", {
      is: whenType,
      then: (s) =>
        s
          .typeError(`${label} es requerido`)
          .moreThan(0, "Debe ser mayor a 0")
          .max(100, "Máximo 100")
          .required(`${label} es requerido`),
      otherwise: (s) => s.strip(),
    });

const isVolumeAbsoluteTier = (tier) => (type, priceMode, tiers) =>
  type === "volume_price" && priceMode === "absolute" && (!tiers?.length || tiers.includes(tier));

const volumePriceField = (tier) =>
  yup
    .number()
    .nullable()
    .when(["type", "priceMode", "applicableTiers"], {
      is: isVolumeAbsoluteTier(tier),
      then: (s) => s.typeError("Requerido").min(0, "Debe ser ≥ 0").required("Requerido"),
      otherwise: (s) => s.strip(),
    });

const volumePriceFields = Object.fromEntries(
  PRICE_TIERS.map((tier) => [`volumePrice${tier}`, volumePriceField(tier)])
);

// Campos de valor (sin ámbito) — los comparten el modal y el composer batch.
export const promotionValueSchema = yup.object().shape({
  name: yup.string().trim().required("El nombre de la promoción es requerido"),
  type: yup.string().oneOf(["percentage", "volume_price"]).required(),
  applicableTiers: yup.array().of(yup.string().oneOf(PRICE_TIERS)).default([]),
  month: yup.number().min(0).max(11).required("Selecciona el mes"),
  year: yup.number().required("Selecciona el año"),
  active: yup.boolean().default(true),

  discountPercentage: percentageField("El porcentaje", "percentage"),

  minQuantity: yup
    .number()
    .nullable()
    .when("type", {
      is: "volume_price",
      then: (s) => s.typeError("Requerido").min(2, "Mínimo 2").required("Requerido"),
      otherwise: (s) => s.strip(),
    }),
  priceMode: yup
    .string()
    .nullable()
    .when("type", {
      is: "volume_price",
      then: (s) => s.oneOf(["percentage", "absolute"]).required("Selecciona el modo de precio"),
      otherwise: (s) => s.strip(),
    }),
  volumeDiscountPercentage: yup
    .number()
    .nullable()
    .when(["type", "priceMode"], {
      is: (type, priceMode) => type === "volume_price" && priceMode === "percentage",
      then: (s) =>
        s
          .typeError("El % es requerido")
          .moreThan(0, "Debe ser mayor a 0")
          .max(100, "Máximo 100")
          .required("El % es requerido"),
      otherwise: (s) => s.strip(),
    }),
  ...volumePriceFields,
});

export const promotionSchema = promotionValueSchema.shape({
  scopeKind: yup.string().oneOf(["brand", "category", "subcategory", "type", "product"]).required(),
  scopeOption: yup.object().nullable().required("Selecciona un alcance"),
});
