import { getCategories } from "../../actions/categories";
import { MainLayout } from "../../layouts/main/MainLayout";

export const metadata = {
  title: "Home",
  description: "Home",
};

export default async function Layout({ children }) {
  const categories = await getCategories();

  return <MainLayout categories={categories}>{children}</MainLayout>;
}
