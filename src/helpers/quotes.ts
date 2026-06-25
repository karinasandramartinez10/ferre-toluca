import { STEPS } from "../constants/quotes/status";
import type { QuoteProduct, QuoteProductJoin } from "../types/quote";

export const statusLabelMap: Record<string, string> = STEPS.reduce(
  (acc, { value, label }) => ({ ...acc, [value]: label }),
  {} as Record<string, string>
);

// lineTotal no lo devuelve el BE — se deriva (§5): quantity * unitPrice - discountAmount.
export const getQuoteLineTotal = (qp?: QuoteProductJoin): number =>
  qp ? qp.quantity * Number(qp.unitPrice) - (qp.discountAmount ?? 0) : 0;

export const getQuoteGrandTotal = (products: QuoteProduct[] = []): number =>
  products.reduce((sum, p) => sum + getQuoteLineTotal(p.QuoteProduct), 0);
