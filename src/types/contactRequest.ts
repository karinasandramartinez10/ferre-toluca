export type ContactRequestStatus = "pending" | "contacted" | "invited" | "rejected";

export interface ContactRequest {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string | null;
  companyName: string | null;
  message: string | null;
  status: ContactRequestStatus;
  createdAt: string;
}

export interface CreateContactRequestBody {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  companyName?: string;
  message?: string;
}
