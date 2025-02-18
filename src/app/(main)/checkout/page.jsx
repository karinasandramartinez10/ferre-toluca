import { auth } from "../../../auth";
import CheckoutPage from "./CheckoutPage";

export default async function Page() {
  const session = await auth();

  return <CheckoutPage session={session} />;
}
