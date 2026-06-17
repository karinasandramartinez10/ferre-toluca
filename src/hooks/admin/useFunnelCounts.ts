import { useQuery } from "@tanstack/react-query";
import { getContactRequests } from "../../api/contactRequests";
import { getInvitations } from "../../api/invitations";
import { queryKeys } from "../../constants/queryKeys";
import { staleTimes, gcTimes } from "../../constants/queryConfig";

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

  return {
    solicitudes: solicitudes.data ?? null,
    invitaciones: invitaciones.data ?? null,
    clientes: null,
  };
}
