import { fetchAllProductsServer } from "../../../../actions/product";
import { ErrorUI } from "../../../../components/Error";
import Products from "./Products";

export default async function ProductsPage() {
  try {
    const products = await fetchAllProductsServer(1, 10);
    return <Products initialData={products} />;
  } catch (error) {
    return (
      <ErrorUI
        href="/admin/products"
        message="No pudimos cargar los productos"
      />
    );
  }
}
