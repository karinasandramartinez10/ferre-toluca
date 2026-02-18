import privateApi from "../config/private";
import { getApiErrorMessage } from "../utils/apiError";

export const postProduct = async (formData) => {
  try {
    const resp = await privateApi.post("/product", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return resp;
  } catch (error) {
    console.log("err", error);
    throw new Error(getApiErrorMessage(error));
  }
};

export const postBulkCSV = async (formData) => {
  try {
    const resp = await privateApi.post("/product/bulk-csv", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return resp;
  } catch (error) {
    throw error;
  }
};
