import { MainLayout } from "../../layouts/main/MainLayout";

export const metadata = {
  title: "Home",
  description: "Home",
};

export default function Layout({ children }) {
  return <MainLayout>{children}</MainLayout>;
}
