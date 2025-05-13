export const dynamic = "force-dynamic";
import { fetchQuoteServer } from "../../../../../actions/quotes";
import { auth } from "../../../../../auth";
import { ErrorUI } from "../../../../../components/Error";
import { QuoteId } from "./QuoteIdPage";

export default async function QuoteIdPage({ params: { id } }) {
  try {
    const session = await auth();
    const token = session?.user?.access_token;
    if (!token) throw new Error('No autenticado');
  
    const result = await fetchQuoteServer(token, id);
    const quote = result ?? {};

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
