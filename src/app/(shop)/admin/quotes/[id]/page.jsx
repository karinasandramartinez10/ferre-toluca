import { QuoteId } from "./QuoteIdPage";

export default async function QuoteIdPage({ params }) {
  const { id } = params;
  return <QuoteId quoteId={id} />;
}
