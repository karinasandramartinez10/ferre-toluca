import { api } from "../config";
import { getApiErrorMessage } from "../utils/apiError";

export const getBrands = async (): Promise<{ id: number; name: string }[]> => {
  try {
    const { data } = await api.get("/brands", { params: { size: 1000 } });
    return data.data?.brands ?? [];
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
};
