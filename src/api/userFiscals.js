import privateApi from "../config/private";
import { getApiErrorMessage } from "../utils/apiError";

// List all fiscal profiles for current user
export const getUserFiscals = async (options = {}) => {
  try {
    const { data } = await privateApi.get("/user-fiscals", {
      signal: options.signal,
    });
    return Array.isArray(data?.data) ? data.data : [];
  } catch (error) {
    if (error.code === "ERR_CANCELED") return [];
    throw new Error(getApiErrorMessage(error));
  }
};

// Get default fiscal profile
export const getDefaultUserFiscal = async (options = {}) => {
  try {
    const { data } = await privateApi.get("/user-fiscals/default", {
      signal: options.signal,
    });
    return data?.data ?? null;
  } catch (error) {
    if (error.code === "ERR_CANCELED" || error.response?.status === 404)
      return null;
    throw new Error(getApiErrorMessage(error));
  }
};

// Create a profile
export const createUserFiscal = async (payload) => {
  try {
    const { data } = await privateApi.post("/user-fiscals", payload);
    return data?.data ?? null;
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
};

// Update a profile
export const updateUserFiscal = async (id, payload) => {
  try {
    const { data } = await privateApi.put(`/user-fiscals/${id}`, payload);
    return data?.data ?? null;
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
};

// Mark as default
export const setDefaultUserFiscal = async (id) => {
  try {
    const { data } = await privateApi.put(`/user-fiscals/${id}/default`);
    return data?.data ?? true;
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
};

// Delete a profile
export const deleteUserFiscal = async (id) => {
  try {
    const { data } = await privateApi.delete(`/user-fiscals/${id}`);
    return data?.data ?? true;
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
};

export default {
  getUserFiscals,
  getDefaultUserFiscal,
  createUserFiscal,
  updateUserFiscal,
  setDefaultUserFiscal,
  deleteUserFiscal,
};
