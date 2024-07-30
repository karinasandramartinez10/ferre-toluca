import { api } from "../config";

export const getCategories = async () => {
try {
  const { data } = await api.get("/category")
  return data

} catch (error) {
  console.log(error)
  throw new Error(error.response.data.message);
}
}
