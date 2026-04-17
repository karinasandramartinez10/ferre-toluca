import { api } from "../config";
import privateApi from "../config/private";
import { getApiErrorMessage } from "../utils/apiError";
import type { Invitation, InvitationValidation, CreateInvitationBody } from "../types/invitation";

export const validateInvitation = async (token: string): Promise<InvitationValidation> => {
  try {
    const { data } = await api.get(`/invitations/validate/${token}`);
    return data;
  } catch {
    return { valid: false };
  }
};

export const getInvitations = async (
  page = 1,
  size = 20,
  status?: string
): Promise<{ invitations: Invitation[]; count: number; page: number; totalPages: number }> => {
  try {
    const params: Record<string, unknown> = { page, size };
    if (status) params.status = status;

    const { data } = await privateApi.get("/invitations", { params });
    return data.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
};

export const createInvitation = async (body: CreateInvitationBody): Promise<Invitation> => {
  try {
    const { data } = await privateApi.post("/invitations", body);
    return data.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
};

export const revokeInvitation = async (id: number): Promise<void> => {
  try {
    await privateApi.delete(`/invitations/${id}`);
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
};
