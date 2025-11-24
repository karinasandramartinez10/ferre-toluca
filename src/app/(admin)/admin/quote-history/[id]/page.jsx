import { QuoteId } from "./QuoteIdPage";

export default async function QuoteHistoryIdPage({ params: { id } }) {
  return <QuoteId quoteId={id} />;
}

