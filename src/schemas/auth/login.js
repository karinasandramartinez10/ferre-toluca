import * as yup from "yup";

export const LoginSchema = yup.object().shape({
  email: yup.string().email("email inválido").required("emailRequired"),
  password: yup
    .string()
    .transform((x) => (x === "" ? undefined : x))
    .required("passwordRequired"),
});
