"use client";

import { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Stack } from "@mui/material";
import { ContactMail, MailOutline, Groups } from "@mui/icons-material";
import { CustomerFunnelHeader } from "./CustomerFunnelHeader";
import { useFunnelCounts } from "../../../../hooks/admin/useFunnelCounts";
import ContactRequests from "./ContactRequests";
import Invitations from "./Invitations";
import Clients from "./Clients";

const STAGES = [
  {
    key: "solicitudes",
    label: "Solicitudes",
    icon: <ContactMail />,
    countLabel: "pendientes",
    Component: ContactRequests,
    superadminOnly: false,
  },
  {
    key: "invitaciones",
    label: "Invitaciones",
    icon: <MailOutline />,
    countLabel: "pendientes",
    Component: Invitations,
    superadminOnly: true,
  },
  {
    key: "clientes",
    label: "Clientes",
    icon: <Groups />,
    countLabel: "total",
    Component: Clients,
    superadminOnly: false,
  },
];

const DEFAULT_TAB = "clientes";

const CustomersHub = () => {
  const { data: session } = useSession();
  const isSuperadmin = session?.user?.role === "superadmin";
  const router = useRouter();
  const searchParams = useSearchParams();
  const counts = useFunnelCounts();

  const stages = useMemo(
    () => STAGES.filter((s) => !s.superadminOnly || isSuperadmin),
    [isSuperadmin]
  );

  const requested = searchParams.get("tab");
  const activeKey = stages.some((s) => s.key === requested) ? requested : DEFAULT_TAB;

  const handleSelect = (key) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", key);
    router.replace(`/admin/clients?${params.toString()}`, { scroll: false });
  };

  const steps = stages.map((s) => ({
    key: s.key,
    label: s.label,
    icon: s.icon,
    count: counts[s.key],
    countLabel: s.countLabel,
  }));

  const ActiveComponent = (stages.find((s) => s.key === activeKey) || stages[0]).Component;

  return (
    <Stack spacing={3}>
      <CustomerFunnelHeader steps={steps} activeKey={activeKey} onSelect={handleSelect} />
      <ActiveComponent />
    </Stack>
  );
};

export default CustomersHub;
