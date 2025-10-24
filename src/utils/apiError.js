export const getApiErrorMessage = (error) => {
  const msg = error?.response?.data?.message || error?.message;

  if (typeof msg === "string" && msg.trim().length > 0) return msg;

  return "Error desconocido";
};
