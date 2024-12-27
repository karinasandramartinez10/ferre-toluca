import axios from "axios";
import { getSession } from "next-auth/react";

export const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BACKEND_API_URL}`,
});

api.interceptors.request.use(
  async (config) => {
    try {
      const session = await getSession();
      if (session?.user?.access_token) {
        config.headers.Authorization = `Bearer ${session.user.access_token}`;
      }
    } catch (error) {
      console.error(`Error setting token in request header ${error}`);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
