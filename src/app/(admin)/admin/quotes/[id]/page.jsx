import { QuoteId } from "./QuoteIdPage";

export default async function QuoteIdPage({ params: { id } }) {
  return <QuoteId quoteId={id} />;
}
