import { Typography } from "@mui/material";
import { getProductById } from "../../../../actions/product";
import { auth } from "../../../../auth";
import ProductPage from "./ProductPage";

export default async function Page({ params }) {
  const session = await auth();

  const product = await getProductById(params.id);
  if (!product) {
    return <Typography>No se encontró el producto</Typography>;
  }

  return <ProductPage product={product} role={session?.user.role} />;
}
