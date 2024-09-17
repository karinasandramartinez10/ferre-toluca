import { redirect } from "next/navigation";
import { auth } from "../../../../auth";
import AddProduct from "./AddProduct";

export default async function AddProductPage() {
  const session = await auth();

  if (session?.user?.role !== "admin") {
    redirect("/auth/login");
  }

  return <AddProduct user={session.user} />;
}
