import { getSubcategorySlugsServer } from "../../../../actions/subcategories";
import { revalidateTimes } from "../../../../constants/revalidation";
import SubcategoriesPage from "./SubcategoriesPage";

export const revalidate = revalidateTimes.DEFAULT;

function toSlug(text) {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9áéíóúüñ-]/gi, "");
}

export async function generateStaticParams() {
  if (process.env.VERCEL_ENV === "preview") return [];

  const subcategories = await getSubcategorySlugsServer();
  return subcategories.map((sub) => ({
    name: toSlug(sub.name),
  }));
}

export default async function Page() {
  return <SubcategoriesPage />;
}
