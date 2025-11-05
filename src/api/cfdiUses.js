import { api } from "../config";
import { getApiErrorMessage } from "../utils/apiError";

export const getCfdiUses = async (options = {}) => {
  try {
    const { data } = await api.get("/cfdi-uses", { signal: options.signal });
    return Array.isArray(data?.data) ? data.data : data;
  } catch (error) {
    if (error.code === "ERR_CANCELED") return [];
    throw new Error(getApiErrorMessage(error));
  }
};
export default getCfdiUses;
