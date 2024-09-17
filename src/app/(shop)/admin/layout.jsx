import { AdminLayout } from "../../../layouts/admin/AdminLayout";

export const metadata = {
  title: 'Panel de administrador',
}

export default function AdminLayoutPage({ children }) {

  return <AdminLayout>{children}</AdminLayout>
}
