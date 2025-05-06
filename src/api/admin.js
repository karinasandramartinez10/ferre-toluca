import privateApi from "../config/private";

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
    throw new Error(error.response.data.message);
  }
};
