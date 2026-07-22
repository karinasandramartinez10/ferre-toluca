import { api } from "../config";
import privateApi from "../config/private";
import { getApiErrorMessage } from "../utils/apiError";

// Manda el token a la blacklist del BE. Sin esto, cerrar sesión sólo borra la cookie
// local y el access_token sigue siendo válido hasta que expire.
export const revokeSession = async () => {
  await privateApi.get("/auth/logout");
};

export const registerUser = async (body) => {
  try {
    await api.post("/auth/signup", body);
    return null;
  } catch (error) {
    return error;
  }
};

export const forgotPassword = async (body) => {
  try {
    const resp = await api.post("/auth/recovery", body, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return resp;
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
};

export const resetPassword = async (body) => {
  try {
    const resp = await api.post("/auth/reset-password", body, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return resp;
  } catch (error) {
    const msg = error?.response?.data?.message;
    if (msg === "jwt expired") {
      throw new Error("Expiró el token");
    } else {
      throw new Error(getApiErrorMessage(error));
    }
  }
};
