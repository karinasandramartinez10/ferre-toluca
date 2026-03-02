import type { SvgIconComponent } from "@mui/icons-material";

// ── Domain enums ────────────────────────────────────────────────

export type QuoteId = string | number;

export type QuoteStatus = "IN_REVIEW" | "PARTIALLY_AVAILABLE" | "READY_FOR_DISPATCH" | "DISPATCHED";

// ── Step (stepper UI) ───────────────────────────────────────────

export interface QuoteStatusStep {
  value: QuoteStatus;
  label: string;
  Icon: SvgIconComponent;
}

// ── User ────────────────────────────────────────────────────────

export interface QuoteUser {
  id: string | number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}

// ── Fiscal ──────────────────────────────────────────────────────

export interface FiscalProfile {
  fiscalName: string;
  rfc: string;
  TaxRegime?: { description: string };
  defaultCfdiUse?: { description: string };
}

// ── Product ─────────────────────────────────────────────────────

export interface QuoteProductJoin {
  quantity: number;
}

export interface QuoteProduct {
  id: string | number;
  name: string;
  code: string;
  brand?: { name: string };
  Files?: { publicId: string }[];
  QuoteProduct?: QuoteProductJoin;
}

// ── Quote ───────────────────────────────────────────────────────

export interface Quote {
  id: string | number;
  orderNumber?: string;
  order?: string;
  status: QuoteStatus;
  createdAt: string;
  updatedAt: string;
  message?: string;
  User: QuoteUser;
  Products: QuoteProduct[];
  fiscalProfile?: FiscalProfile;
}

// ── Status Logs ─────────────────────────────────────────────────

export interface StatusLogEntry {
  id: string | number;
  changedBy: string;
  oldStatus: string;
  newStatus: string;
  changedAt: string;
}

export interface CreateLogEntryPayload {
  oldStatus: string;
  newStatus: string;
  changedAt: string;
}

// ── Mutations ───────────────────────────────────────────────────

export interface UpdateQuoteStatusVars {
  status: string;
  updatedAt: string;
}

// ── Mutations (hooks) ────────────────────────────────────────────

export interface AppendLogVars {
  quoteId: QuoteId;
  entry: CreateLogEntryPayload;
}

// ── Messages ────────────────────────────────────────────────────

export interface QuoteMessage {
  id: string | number;
  senderId: string | number;
  quoteId: QuoteId;
  content: string;
  createdAt: string;
}

// ── Filters (order history) ─────────────────────────────────────

export interface OrderHistoryFilters {
  page?: number;
  size?: number;
  status?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}
