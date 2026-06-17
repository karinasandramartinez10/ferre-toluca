"use client";

import { useCallback, useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Box, CircularProgress, Stack, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { AnimatePresence, motion } from "framer-motion";
import { useSnackbar } from "notistack";
import { getContactRequests, updateContactRequestStatus } from "../../../../api/contactRequests";
import { createInvitation } from "../../../../api/invitations";
import { queryKeys } from "../../../../constants/queryKeys";
import { ErrorUI } from "../../../../components/Error";
import FilterSelect from "../../../../components/FilterSelect";
import useProcessingIds from "../../../../hooks/admin/useProcessingIds";
import ContactRequestCard from "./ContactRequestCard";

const PAGE_SIZE = 10;

const STATUS_FILTERS = [
  { value: "pending", label: "Pendientes" },
  { value: "contacted", label: "Contactadas" },
  { value: "", label: "Todas" },
];

const ContactRequests = () => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState("pending");
  const [items, setItems] = useState([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(false);
  const { processingIds, addProcessing, removeProcessing } = useProcessingIds();

  const fetchPage = useCallback(
    async (pageToLoad, append) => {
      append ? setLoadingMore(true) : setLoading(true);
      setError(false);
      try {
        const res = await getContactRequests(pageToLoad, PAGE_SIZE, statusFilter || undefined);
        setCount(res.count);
        setPage(pageToLoad);
        setItems((prev) => (append ? [...prev, ...res.contactRequests] : res.contactRequests));
      } catch {
        setError(true);
      } finally {
        append ? setLoadingMore(false) : setLoading(false);
      }
    },
    [statusFilter]
  );

  useEffect(() => {
    fetchPage(1, false);
  }, [fetchPage]);

  const handleAction = useCallback(
    async (request, newStatus) => {
      addProcessing(request.id);
      try {
        if (newStatus === "invited") {
          await createInvitation({
            email: request.email,
            companyName: request.companyName || undefined,
          });
          try {
            await updateContactRequestStatus(request.id, "invited");
          } catch {
            enqueueSnackbar(
              "Invitación enviada pero no se pudo actualizar el status. Recarga la página.",
              { variant: "warning" }
            );
            return;
          }
          enqueueSnackbar(`Invitación enviada a ${request.email}`, { variant: "success" });
        } else {
          await updateContactRequestStatus(request.id, newStatus);
          enqueueSnackbar("Status actualizado", { variant: "success" });
        }

        queryClient.invalidateQueries({ queryKey: queryKeys.funnelCounts });

        // Si la solicitud ya no pertenece al filtro activo, sale de la lista;
        // si estamos en "Todas", solo actualiza su estado en sitio.
        if (statusFilter && newStatus !== statusFilter) {
          setItems((prev) => prev.filter((r) => r.id !== request.id));
          setCount((c) => Math.max(0, c - 1));
        } else {
          setItems((prev) =>
            prev.map((r) => (r.id === request.id ? { ...r, status: newStatus } : r))
          );
        }
      } catch (err) {
        enqueueSnackbar(err?.message || "Error al actualizar", { variant: "error" });
      } finally {
        removeProcessing(request.id);
      }
    },
    [enqueueSnackbar, queryClient, statusFilter, addProcessing, removeProcessing]
  );

  const hasMore = items.length < count;

  return (
    <Stack spacing={2} sx={{ maxWidth: 820 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <FilterSelect value={statusFilter} onChange={setStatusFilter} options={STATUS_FILTERS} />
        {!loading && (
          <Typography variant="body2" color="text.secondary">
            {count} {count === 1 ? "solicitud" : "solicitudes"}
          </Typography>
        )}
      </Stack>

      {loading ? (
        <Box sx={{ py: 8, display: "flex", justifyContent: "center" }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <ErrorUI onRetry={() => fetchPage(1, false)} message="No pudimos cargar las solicitudes" />
      ) : items.length === 0 ? (
        <Box sx={{ py: 8, textAlign: "center" }}>
          <Typography color="text.secondary">No hay solicitudes en esta vista</Typography>
        </Box>
      ) : (
        <>
          <Stack spacing={1.5}>
            <AnimatePresence initial={false}>
              {items.map((request) => (
                <motion.div
                  key={request.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.18 }}
                >
                  <ContactRequestCard
                    request={request}
                    processing={processingIds.has(request.id)}
                    onAction={handleAction}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </Stack>

          {hasMore && (
            <Box sx={{ textAlign: "center" }}>
              <LoadingButton
                onClick={() => fetchPage(page + 1, true)}
                loading={loadingMore}
                variant="outlined"
              >
                Cargar más
              </LoadingButton>
            </Box>
          )}
        </>
      )}
    </Stack>
  );
};

export default ContactRequests;
