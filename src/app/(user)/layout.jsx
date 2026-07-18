import UserProfileLayout from "../../layouts/user/UserProfileLayout";
import { auth } from "../../auth";

export const metadata = {
  title: "Ferretera Toluca",
  description: "Usuario",
  icons: {
    icon: "/iso_toluca.svg",
  },
};

export default async function Layout({ children }) {
  const session = await auth();
  return <UserProfileLayout session={session}>{children}</UserProfileLayout>;
}
