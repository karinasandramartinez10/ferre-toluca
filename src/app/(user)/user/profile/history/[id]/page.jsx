import UserQuoteIdPage from "./UserQuoteIdPage";

export default function UserQuoteDetailPage({ params: { id } }) {
  return <UserQuoteIdPage quoteId={id} />;
} 