export const RATE_LIMITED_CODE = "rate_limited";

export const signInErrorMessage = (res) =>
  res?.code === RATE_LIMITED_CODE
    ? "Demasiados intentos. Espera unos minutos e intenta de nuevo."
    : "Correo o contraseña incorrectos";
