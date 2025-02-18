import { auth } from "../../../auth";
import { OrderProvider } from "../../../context/order/OrderProvider";
import CheckoutPage from "./CheckoutNewPage";

export default async function Page() {
  const session = await auth();

  return (
    <OrderProvider>
      <CheckoutPage session={session} />
    </OrderProvider>
  );
}
