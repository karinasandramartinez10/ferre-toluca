export const dynamic = "force-dynamic";
import { fetchQuotesServer } from "../../../../actions/quotes";
import { auth } from "../../../../auth";
import { ErrorUI } from "../../../../components/Error";
import { Quotes } from "./Quotes";

export default async function QuotesPage() {
  try {
    const session = await auth();
    const token = session?.user?.access_token;
    const result = await fetchQuotesServer(token, 1, 10);
    const quotes = Array.isArray(result.quotes) ? result.quotes : [];
    const totalCount =
      typeof result.totalCount === "number" ? result.totalCount : 0;
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
