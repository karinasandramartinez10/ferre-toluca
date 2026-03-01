import { getProductTypeSlugsServer } from "../../../../actions/productTypes";
import { revalidateTimes } from "../../../../constants/revalidation";
import TypeProductsPage from "./TypeProductsPage";

export const revalidate = revalidateTimes.DEFAULT;

function toSlug(text) {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9áéíóúüñ-]/gi, "");
}

export async function generateStaticParams() {
  if (process.env.VERCEL_ENV === "preview") return [];

  const productTypes = await getProductTypeSlugsServer();
  return productTypes.map((type) => ({
    name: toSlug(type.name),
  }));
}

export default async function Page() {
  return <TypeProductsPage />;
}
