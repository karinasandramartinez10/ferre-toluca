import axios from "axios";
import { api } from "../config";

export const registerUser = async (body) => {
  console.log(body);
  try {
    await api.post("/auth/signup", body);
    return {
      hasError: false,
    };
  } catch (error) {
    console.log(error);
    if (axios.isAxiosError(error)) {
      return {
        hasError: true,
        message: error.response?.data.message,
      };
    }
    return {
      hasError: true,
      message: "Account not created",
    };
  }
};
