import { api } from "../config";

export const getBrands = async () => {
try {
  const { data } = await api.get("/brands")
  return data.data

} catch (error) {
  console.log(error)
  throw new Error(error.response.data.message);
}
}
