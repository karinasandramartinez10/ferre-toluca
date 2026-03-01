import { Typography } from "@mui/material";
import { getProductById, getPopularProductIdsServer } from "../../../../actions/product";
import { revalidateTimes } from "../../../../constants/revalidation";
import ProductPage from "./ProductPage";

export const revalidate = revalidateTimes.DEFAULT;

export async function generateStaticParams() {
  if (process.env.VERCEL_ENV === "preview") return [];

  const ids = await getPopularProductIdsServer();
  return ids.map((id) => ({
    id: String(id),
  }));
}

export default async function Page({ params }) {
  const product = await getProductById(params.id);

  if (!product) {
    return <Typography>No se encontró el producto</Typography>;
  }

  return <ProductPage key={params.id} product={product} />;
}
