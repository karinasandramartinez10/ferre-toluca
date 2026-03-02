import { QuoteId } from "../../components/quote-detail/QuoteIdPage";

export default async function QuoteIdPage({ params: { id } }: { params: { id: string } }) {
  return <QuoteId quoteId={id} />;
}
