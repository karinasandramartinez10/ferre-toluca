import { useQuery } from "@tanstack/react-query";
import { getContactRequests } from "../../api/contactRequests";
import { getInvitations } from "../../api/invitations";
import { getAllUsers } from "../../api/admin/users";
import { queryKeys } from "../../constants/queryKeys";
import { staleTimes, gcTimes } from "../../constants/queryConfig";

/**
 * Conteos por etapa del funnel de clientes para los badges del hub:
 * solicitudes pendientes, invitaciones pendientes y total de clientes.
 * Cada endpoint ya devuelve `count`; se pide con size=1 para que sea ligero.
 */
export function useFunnelCounts() {
  const solicitudes = useQuery({
    queryKey: queryKeys.funnelCount("solicitudes"),
    queryFn: () => getContactRequests(1, 1, "pending"),
    select: (data) => data.count,
    staleTime: staleTimes.FREQUENT,
    gcTime: gcTimes.SHORT,
  });

  const invitaciones = useQuery({
    queryKey: queryKeys.funnelCount("invitaciones"),
    queryFn: () => getInvitations(1, 1, "pending"),
    select: (data) => data.count,
    staleTime: staleTimes.FREQUENT,
    gcTime: gcTimes.SHORT,
  });

  const clientes = useQuery({
    queryKey: queryKeys.funnelCount("clientes"),
    queryFn: () => getAllUsers(1, 1, { role: "user" }),
    select: (data) => data.count,
    staleTime: staleTimes.FREQUENT,
    gcTime: gcTimes.SHORT,
  });

  return {
    solicitudes: solicitudes.data ?? null,
    invitaciones: invitaciones.data ?? null,
    clientes: clientes.data ?? null,
  };
}
