import { getCategoriesServer } from "../../../../actions/categories";
import { revalidateTimes } from "../../../../constants/revalidation";
import CategoryProductsPage from "./CategoryProductsPage";

export const revalidate = revalidateTimes.DEFAULT;

export async function generateStaticParams() {
  if (process.env.VERCEL_ENV === "preview") return [];

  const categories = await getCategoriesServer();
  return categories.map((cat) => ({
    name: cat.path,
  }));
}

export default async function Page() {
  return <CategoryProductsPage />;
}
