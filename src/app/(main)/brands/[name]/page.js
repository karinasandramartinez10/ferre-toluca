import { auth } from "../../../../auth";
import BrandProductsPage from "./BrandProductsPage";

export default async function Page() {
  const session = await auth();

  return <BrandProductsPage session={session} />;
}
