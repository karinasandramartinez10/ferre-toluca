import { getBrandsServer } from "../../actions/brand";
import { fetchGroupedProductsServer } from "../../actions/product";
import { auth } from "../../auth";
import { MainPage } from "./MainPage";

export default async function Page() {
  const session = await auth();
  const brands = await getBrandsServer();
  const groupedProducts = await fetchGroupedProductsServer()

  return (
    <MainPage
      session={session}
      brands={brands}
      products={groupedProducts}
    />
  );
}
