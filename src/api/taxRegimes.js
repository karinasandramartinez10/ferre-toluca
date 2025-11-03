import { api } from "../config";
import { getApiErrorMessage } from "../utils/apiError";

export const getTaxRegimes = async (options = {}) => {
  try {
    const { data } = await api.get("/tax-regimes", { signal: options.signal });
    return Array.isArray(data?.data) ? data.data : data;
  } catch (error) {
    if (error.code === "ERR_CANCELED") return [];
    throw new Error(getApiErrorMessage(error));
  }
};

export default getTaxRegimes;
