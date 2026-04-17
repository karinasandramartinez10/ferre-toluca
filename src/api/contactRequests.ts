import { api } from "../config";
import privateApi from "../config/private";
import { getApiErrorMessage, createApiError } from "../utils/apiError";
import type {
  ContactRequest,
  ContactRequestStatus,
  CreateContactRequestBody,
} from "../types/contactRequest";

export const submitContactRequest = async (body: CreateContactRequestBody): Promise<void> => {
  try {
    await api.post("/contact-requests", body);
  } catch (error) {
    throw createApiError(error);
  }
};

export const getContactRequests = async (
  page = 1,
  size = 20,
  status?: string
): Promise<{
  contactRequests: ContactRequest[];
  count: number;
  page: number;
  totalPages: number;
}> => {
  try {
    const params: Record<string, unknown> = { page, size };
    if (status) params.status = status;

    const { data } = await privateApi.get("/contact-requests", { params });
    return data.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
};

export const updateContactRequestStatus = async (
  id: number,
  status: ContactRequestStatus
): Promise<void> => {
  try {
    await privateApi.patch(`/contact-requests/${id}`, { status });
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
};
