import { redirect } from "next/navigation";

export default function InvitationsPage() {
  redirect("/admin/clients?tab=invitaciones");
}
