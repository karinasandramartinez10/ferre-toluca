import { auth } from "../../../../auth";
import Subcategories from "./Subcategories";

export default async function CategoriesPage() {
  const session = await auth();

  return <Subcategories user={session.user} />;
}
