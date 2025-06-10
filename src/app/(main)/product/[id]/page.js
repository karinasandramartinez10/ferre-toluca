import { Typography } from "@mui/material";
import { getProductById } from "../../../../actions/product";
import { auth } from "../../../../auth";
import ProductPage from "./ProductPage";

export default async function Page({ params }) {
  const session = await auth(); // TODO: quitar auth y manejar useSession en ProductPage, renderear condicionalmente y hacer que no se dispare el fetch de favorites a menos que el user este loggeado

  const product = await getProductById(params.id);

  if (!product) {
    return <Typography>No se encontró el producto</Typography>;
  }

  return (
    <ProductPage key={params.id} product={product} role={session?.user.role} />
  );
}
