import { getCategories } from "../../actions/categories";
import { MainLayout } from "../../layouts/main/MainLayout";

export const metadata = {
  title: "Ferreteria Texcoco",
  description: "Home",
  icons: {
    icon: "/iso_texcoco.svg",
  },
};

export default async function Layout({ children }) {
  const categories = await getCategories();

  return <MainLayout categories={categories}>{children}</MainLayout>;
}
