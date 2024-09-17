import { Grid, Typography } from "@mui/material";
import { getCategories } from "../../actions/categories";
import { MainLayout } from "../../layouts/main/MainLayout";

export const metadata = {
  title: "Home",
  description: "Home",
};

export default async function Layout({ children }) {
  const categories = await getCategories();

  return (
    <MainLayout categories={categories}>
      <Grid
        container
        rowGap={{
          xs: 1,
          md: 0,
        }}
        sx={{
          paddingLeft: { xs: "16px", md: "32px" },
          paddingRight: { xs: "16px", md: "32px" },
        }}
      >

        {children}
      </Grid>
    </MainLayout>
  );
}
