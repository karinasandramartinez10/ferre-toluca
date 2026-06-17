import privateApi from "../../config/private";
import { getApiErrorMessage } from "../../utils/apiError";
import type { PriceTier } from "../../types/pricing";
import type { AdminUsersResult } from "../../types/user";

export const getAllUsers = async (
  page = 1,
  size = 50,
  { search, tier, role }: { search?: string; tier?: PriceTier; role?: string } = {}
): Promise<AdminUsersResult> => {
  try {
    const params: Record<string, unknown> = { page, size };
    if (search) params.search = search;
    if (tier) params.tier = tier;
    if (role) params.role = role;

    const { data } = await privateApi.get("/user/all", { params });
    return data.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
};

export const updateUserTier = async (id: number, priceTier: PriceTier): Promise<void> => {
  try {
    await privateApi.patch(`/user/${id}/tier`, { priceTier });
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
};
