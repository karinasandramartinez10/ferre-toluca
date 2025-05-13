import { fetchQuoteServer } from "../../../../../actions/quotes";
import { auth } from "../../../../../auth";
import { ErrorUI } from "../../../../../components/Error";
import { QuoteId } from "./QuoteIdPage";

export default async function QuoteIdPage({ params: { id } }) {
  const session = await auth();

  try {
    const quote = await fetchQuoteServer(session?.user?.access_token, id);
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
