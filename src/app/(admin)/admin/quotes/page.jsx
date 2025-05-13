import { fetchQuotesServer } from "../../../../actions/quotes";
import { auth } from "../../../../auth";
import { ErrorUI } from "../../../../components/Error";
import { Quotes } from "./Quotes";

export default async function QuotesPage() {
  const session = await auth();
  try {
    const { quotes, totalCount } = await fetchQuotesServer(
      session?.user?.access_token,
      1,
      10
    );
    return (
      <Quotes initialData={{ quotes, totalCount, page: 1, pageSize: 10 }} />
    );
  } catch (error) {
    console.error("SSR fetchQuotesServer error:", error);
    return (
      <ErrorUI
        href="/admin/quotes"
        message="No pudimos cargar las cotizaciones"
      />
    );
  }
}
