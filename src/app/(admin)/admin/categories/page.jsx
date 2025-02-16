import { auth } from "../../../../auth";
import Categories from "./Categories";

export default async function CategoriesPage() {
  const session = await auth();

  return <Categories user={session.user} />;
}
