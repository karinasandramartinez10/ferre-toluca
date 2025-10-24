import { api } from "../config";
import { getApiErrorMessage } from "../utils/apiError";

export const getMeasures = async () => {
  try {
    const { data } = await api.get("/measures");
    return data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
};
