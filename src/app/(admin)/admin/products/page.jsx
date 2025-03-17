import { auth } from "../../../../auth";
import Products from "./Products";

export default async function ProductsPage() {
  const session = await auth();

  return <Products user={session.user} />;
}
