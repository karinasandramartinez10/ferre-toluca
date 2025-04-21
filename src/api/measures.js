import { api } from "../config";

export const getMeasures = async () => {
  try {
    const { data } = await api.get("/measures");
    return data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};
