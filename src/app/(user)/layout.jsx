import UserProfileLayout from "../../layouts/user/UserProfileLayout";

export const metadata = {
  title: "Ferreteria Texcoco",
  description: "Usuario",
  icons: {
    icon: "/iso_texcoco.svg",
  },
};

export default async function Layout({ children }) {
  return <UserProfileLayout>{children}</UserProfileLayout>;
}
