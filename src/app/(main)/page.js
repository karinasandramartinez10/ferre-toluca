import { getBrands } from "../../actions/brand";
import { getProducts } from "../../actions/product";
import { auth } from "../../auth";
import { MainPage } from "./MainPage";

export default async function Page() {
  const session = await auth();
  const brands = await getBrands();
  const products = await getProducts();

  return (
    <MainPage session={session} brands={brands?.brands} products={products} />
  );
}
