import * as yup from "yup";

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

const quantityField = (label) =>
  yup
    .number()
    .nullable()
    .when("type", {
      is: "buy_x_get_y",
      then: (s) =>
        s.typeError(`${label} es requerido`).min(1, "Mínimo 1").required(`${label} es requerido`),
      otherwise: (s) => s.strip(),
    });

// Campos de valor (sin ámbito) — los comparten el modal y el drawer batch.
export const promotionValueSchema = yup.object().shape({
  name: yup.string().trim().required("El nombre de la promoción es requerido"),
  type: yup.string().oneOf(["percentage", "buy_x_get_y"]).required(),
  month: yup.number().min(0).max(11).required("Selecciona el mes"),
  year: yup.number().required("Selecciona el año"),
  active: yup.boolean().default(true),
  discountPercentage: percentageField("El porcentaje", "percentage"),
  buyQuantity: quantityField("Las unidades a pagar"),
  receiveTotal: yup
    .number()
    .nullable()
    .when("type", {
      is: "buy_x_get_y",
      then: (s) =>
        s
          .typeError("Requerido")
          .required("Requerido")
          .moreThan(yup.ref("buyQuantity"), "Debe ser mayor a lo que paga"),
      otherwise: (s) => s.strip(),
    }),
  getDiscountPercentage: percentageField("El % de bonificación", "buy_x_get_y"),
});

export const promotionSchema = promotionValueSchema.shape({
  scopeKind: yup.string().oneOf(["brand", "category", "subcategory", "type", "product"]).required(),
  scopeOption: yup.object().nullable().required("Selecciona un ámbito"),
});
