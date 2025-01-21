import axios from "axios";

export const publicApi = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BACKEND_API_URL}`,
});

export default publicApi;
