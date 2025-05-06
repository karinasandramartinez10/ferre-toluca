import { fetchQuoteServer } from "../../../../../actions/quotes";
import { ErrorUI } from "../../../../../components/Error";
import { QuoteId } from "./QuoteIdPage";

export default async function QuoteIdPage({ params: { id } }) {
  try {
    const quote = await fetchQuoteServer(id);
    return <QuoteId initialData={quote} />;
  } catch (error) {
    return (
      <ErrorUI
        href={`/admin/quotes/${id}`}
        message="No pudimos cargar los detalles de la cotización"
      />
    );
  }
}
