import { Typography } from "@mui/material";
import { getBrands } from "../../actions/brand";
import { auth } from "../../auth";
import { MainPage } from "./MainPage";

export default async function Page() {
  const session = await auth();
  const brands = await getBrands();

  return (
    <>
      <Typography component="h1" variant="h1">
        Marcas
      </Typography>
      <MainPage session={session} brands={brands} />
    </>
  );
}
