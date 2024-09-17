import * as yup from "yup";

export const ProductSchema = yup.object().shape({
  name: yup.string().required("El nombre es requerido"),
  description: yup.string().required("La descripción es requerida"),
  code: yup.string().required("El código es requerido"),
  specifications: yup.string().required("Las características son requeridas"),
  brand: yup.string().required("La marca es requerida"),
});
