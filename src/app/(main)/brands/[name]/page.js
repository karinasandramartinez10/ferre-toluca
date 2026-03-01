import { getBrandsServer } from "../../../../actions/brand";
import { revalidateTimes } from "../../../../constants/revalidation";
import BrandProductsPage from "./BrandProductsPage";

export const revalidate = revalidateTimes.DEFAULT;

export async function generateStaticParams() {
  if (process.env.VERCEL_ENV === "preview") return [];

  const brands = await getBrandsServer();
  if (!Array.isArray(brands)) return [];
  return brands.map((brand) => ({
    name: brand.codeName,
  }));
}

export default async function Page() {
  return <BrandProductsPage />;
}
