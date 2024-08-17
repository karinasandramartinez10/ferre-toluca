import { getCategories } from "../../actions/categories";
import { MainLayout } from "../../layouts/main/MainLayout";

export const metadata = {
  title: "Home",
  description: "Home",
};

export default async function Layout({ children }) {
  const categories = await getCategories()
  return (
    <MainLayout
      AppBarProps={{
        // height: { xs: "54px", md: "64px" },
      }}
      ToolbarProps={{
        // height: { xs: "54px", md: "64px" },
        // minHeight: { xs: "54px", md: "64px" },
      }}
      categories={categories}
    >
      {children}
    </MainLayout>
  );
}
