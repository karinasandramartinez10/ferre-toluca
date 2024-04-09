import { redirect } from "next/navigation";
import { auth } from "../../auth";
import AdminLayoutPage from "./AdminLayoutPage";

export default async function AdminLayout({ children }) {
  const session = await auth();

  if (session?.user.role !== "admin") {
    redirect("/auth/login");
  }

  return <AdminLayoutPage>{children}</AdminLayoutPage>
}
