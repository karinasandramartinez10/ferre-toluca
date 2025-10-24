import { api } from "../config";
import { getApiErrorMessage } from "../utils/apiError";

export const registerUser = async (body) => {
  try {
    await api.post("/auth/signup", body);
    return null;
  } catch (error) {
    console.log(error);
    return error;
    // if (axios.isAxiosError(error)) return error
    // return {
    //   hasError: true,
    //   message: "Account not created",
    // };
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
