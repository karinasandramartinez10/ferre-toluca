export type InvitationStatus = "pending" | "accepted" | "expired" | "revoked";

export interface Invitation {
  id: number;
  email: string;
  companyName: string | null;
  token: string;
  status: InvitationStatus;
  expiresAt: string;
  createdAt?: string;
  invitedById: number;
  invitedBy?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export type InvitationRole = "user" | "admin";

export interface InvitationPrefill {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  companyName?: string;
}

export interface InvitationValidation {
  valid: boolean;
  email?: string;
  companyName?: string | null;
  role?: InvitationRole;
  prefill?: InvitationPrefill | null;
}

export interface CreateInvitationBody {
  email: string;
  companyName?: string;
  role?: InvitationRole;
}
