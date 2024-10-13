import { getProducts } from "../../../actions/product";
import AllProducts from "./AllProducts";

export default async function Page() {
  const products = await getProducts();

  return <AllProducts products={products} />;
}
