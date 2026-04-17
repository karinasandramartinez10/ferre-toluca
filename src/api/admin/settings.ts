import privateApi from "../../config/private";
import { getApiErrorMessage } from "../../utils/apiError";

interface Setting {
  id: number;
  key: string;
  value: string;
  description: string;
}

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
