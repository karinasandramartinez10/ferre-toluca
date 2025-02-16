import { auth } from "../../../../auth";
import ProductType from "./ProductType";

export default async function ProductTypePage() {
  const session = await auth();

  return <ProductType user={session.user} />;
}
