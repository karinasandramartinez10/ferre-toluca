import * as yup from "yup";
import type { FormValues } from "./ProductFormFields";

const isValidOptionalPrice = (v?: string) => !v || (!isNaN(Number(v)) && Number(v) >= 0);

export const productSchema = yup.object().shape({
  name: yup.string().required("El nombre es requerido"),
  description: yup.string().required("La descripción es requerida"),
  code: yup.string().required("El código es requerido"),
  brandId: yup.string().required("La marca es requerida"),
  categoryId: yup.string().required("La categoría es requerida"),
  specifications: yup.string(),
  color: yup.string(),
  qualifier: yup.string(),
  secondaryMeasureValue: yup.string().nullable(),
  secondaryMeasureId: yup.string(),
  subCategoryId: yup.string().defined(),
  typeId: yup.string().defined(),
  measureValue: yup.string().nullable(),
  measureId: yup.string().defined(),
  modelName: yup.string().defined(),
  modelId: yup.string().nullable(),
  image: yup.mixed<File>().nullable(),
  priceA: yup
    .string()
    .required("El precio público (A) es requerido")
    .test("is-valid-a", "Ingresa un precio válido (≥ 0)", (v) => {
      if (v === undefined || v === "") return false;
      const n = Number(v);
      return !isNaN(n) && n >= 0;
    }),
  priceB: yup.string().test("is-valid-b", "Precio inválido (≥ 0)", isValidOptionalPrice),
  priceC: yup.string().test("is-valid-c", "Precio inválido (≥ 0)", isValidOptionalPrice),
  priceD: yup.string().test("is-valid-d", "Precio inválido (≥ 0)", isValidOptionalPrice),
  isAvailable: yup.boolean().defined(),
});

export const productFormDefaults: FormValues = {
  name: "",
  code: "",
  color: "",
  qualifier: "",
  description: "",
  specifications: "",
  brandId: "",
  categoryId: "",
  subCategoryId: "",
  typeId: "",
  measureValue: null,
  measureId: "",
  secondaryMeasureValue: "",
  secondaryMeasureId: "",
  modelName: "",
  modelId: "",
  image: null,
  priceA: "",
  priceB: "",
  priceC: "",
  priceD: "",
  isAvailable: true,
};
