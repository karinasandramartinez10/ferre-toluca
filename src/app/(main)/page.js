export const dynamic = "force-dynamic";
import { getBrands } from "../../actions/brand";
import { fetchAllProductsServer } from "../../actions/product";
import { auth } from "../../auth";
import { MainPage } from "./MainPage";

export default async function Page() {
  const session = await auth();
  const brands = await getBrands();
  const products = await fetchAllProductsServer();

  return (
    <MainPage
      session={session}
      brands={brands?.brands}
      products={products.products}
    />
  );
}
