import { QuoteId } from "../../components/quote-detail/QuoteIdPage";

export default async function QuoteHistoryIdPage({ params: { id } }: { params: { id: string } }) {
  return <QuoteId quoteId={id} />;
}
