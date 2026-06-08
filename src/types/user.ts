import type { PriceTier } from "./pricing";

export interface AdminUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  companyName: string | null;
  phoneNumber: string | null;
  priceTier: PriceTier;
  active: boolean;
  createdAt: string;
  Role?: { name: string };
}

export interface AdminUsersResult {
  users: AdminUser[];
  count: number;
  page: number;
  totalPages: number;
}
