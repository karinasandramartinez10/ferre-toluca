import { AdminLayout } from "../../../layouts/admin/AdminLayout";
import { auth } from "../../../auth";

export const metadata = {
  title: "Panel de administrador",
  icons: {
    icon: "/iso_texcoco.svg",
  },
};

export default async function AdminLayoutPage({ children }) {
  const session = await auth();
  return <AdminLayout session={session}>{children}</AdminLayout>;
}
