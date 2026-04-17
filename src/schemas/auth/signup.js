import * as yup from "yup";
import { differenceInYears } from "date-fns";

const phoneRegExp = /^\+\d{9,15}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;

export const SignUpSchema = yup.object().shape({
  companyName: yup.string().nullable(),
  name: yup.string().required("Nombre es obligatorio"),
  lastname: yup.string().required("Apellido es requerido"),
  email: yup.string().email("Email no es válido").required("Email es obligatorio"),
  dateOfBirth: yup
    .string()
    .nullable()
    .required("La fecha de nacimiento es obligatoria")
    .test(
      "birthday",
      "Para registrarse, debe tener al menos 18 años",
      (value) => differenceInYears(new Date(), new Date(value)) >= 18
    ),
  password: yup
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .matches(
      passwordRegex,
      "La contraseña debe tener al menos una mayúscula, una minúscula y un número"
    )
    .required("Contraseña requerida"),
  confirmPassword: yup
    .string()
    .transform((x) => (x === "" ? undefined : x))
    .required("Se requiere confirmar contraseña")
    .oneOf([yup.ref("password")], "Las contraseñas deben coincidir"),
  phoneNumber: yup
    .string()
    .nullable()
    .required("Teléfono es requerido")
    .matches(phoneRegExp, "Teléfono no es válido"),
  agreeTerms: yup
    .bool()
    .test(
      "agreeTerms",
      "Para crear una cuenta debes aceptar nuestros Términos y Condiciones",
      (value) => value === true
    )
    .required("Para crear una cuenta debes aceptar nuestros Términos y Condiciones"),
});
