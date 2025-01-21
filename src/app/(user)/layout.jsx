import UserLayout from "../../layouts/user/UserLayout";

export const metadata = {
  title: "Ferreteria Texcoco",
  description: "Usuario",
  icons: {
    icon: "/iso_texcoco.svg",
  },
};

export default async function Layout({ children }) {

  return <UserLayout>{children}</UserLayout>;
}
