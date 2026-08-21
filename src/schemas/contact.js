import * as yup from "yup";
import { optionalTel } from "./tel";

export const ContactSchema = yup.object().shape({
  firstName: yup.string().required("El nombre es requerido"),
  lastName: yup.string().required("El apellido es requerido"),
  email: yup.string().email("El email no es válido").required("El email es requerido"),
  phoneNumber: optionalTel(),
  companyName: yup.string().nullable(),
  message: yup.string().nullable(),
});
