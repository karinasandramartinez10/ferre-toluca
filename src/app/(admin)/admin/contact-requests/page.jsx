import { redirect } from "next/navigation";

export default function ContactRequestsPage() {
  redirect("/admin/clients?tab=solicitudes");
}
