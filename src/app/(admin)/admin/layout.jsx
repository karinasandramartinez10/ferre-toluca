import { auth } from "../../../auth";
import { AdminLayout } from "../../../layouts/admin/AdminLayout";

export const metadata = {
  title: "Panel de administrador",
  icons: {
    icon: '/iso_texcoco.svg'
  }
};

export default async function AdminLayoutPage({ children }) {
  const session = await auth();

  return <AdminLayout role={session.user.role}>{children}</AdminLayout>;
}
