import { api } from "../../config";
import privateApi from "../../config/private";
import { getApiErrorMessage } from "../../utils/apiError";

interface Setting {
  id: number;
  key: string;
  value: string;
  description: string;
}

export interface WholesaleThresholds {
  minTotal: number;
  minSameProduct: number;
}

export const getPublicSettings = async (): Promise<WholesaleThresholds> => {
  try {
    const { data } = await api.get("/settings/public");
    const d = data.data;
    return {
      minTotal: Number(d.WHOLESALE_MIN_TOTAL) || 0,
      minSameProduct: Number(d.WHOLESALE_MIN_SAME_PRODUCT) || 0,
    };
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
};

export const getSettings = async (): Promise<Setting[]> => {
  try {
    const { data } = await privateApi.get("/settings");
    return data.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
};

export const updateSetting = async (key: string, value: string): Promise<void> => {
  try {
    await privateApi.patch(`/settings/${key}`, { value });
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
};
