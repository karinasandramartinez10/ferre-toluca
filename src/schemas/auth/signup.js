import * as yup from "yup";
import { differenceInYears } from "date-fns";
import { requiredTel } from "../tel";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;

export const SignUpSchema = yup.object().shape({
  companyName: yup.string().nullable(),
  name: yup.string().required("El nombre es requerido"),
  lastname: yup.string().required("El apellido es requerido"),
  email: yup.string().email("El email no es válido").required("El email es requerido"),
  dateOfBirth: yup
    .string()
    .nullable()
    .required("La fecha de nacimiento es requerida")
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
    .required("La contraseña es requerida"),
  confirmPassword: yup
    .string()
    .transform((x) => (x === "" ? undefined : x))
    .required("La confirmación de contraseña es requerida")
    .oneOf([yup.ref("password")], "Las contraseñas deben coincidir"),
  phoneNumber: requiredTel,
  agreeTerms: yup
    .bool()
    .test(
      "agreeTerms",
      "Para crear una cuenta debes aceptar los Términos y Condiciones y el Aviso de Privacidad",
      (value) => value === true
    )
    .required(
      "Para crear una cuenta debes aceptar los Términos y Condiciones y el Aviso de Privacidad"
    ),
});
