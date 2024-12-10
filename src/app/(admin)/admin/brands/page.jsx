import { auth } from "../../../../auth";
import Brands from "./Brands";

export default async function BrandsPage() {
  const session = await auth();

  return <Brands user={session.user} />;
}
