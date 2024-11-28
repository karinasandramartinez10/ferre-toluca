import { auth } from "../../../../auth";
import AddProduct from "./AddProduct";

export default async function AddProductPage() {
  const session = await auth();

  return <AddProduct user={session.user} />;
}
