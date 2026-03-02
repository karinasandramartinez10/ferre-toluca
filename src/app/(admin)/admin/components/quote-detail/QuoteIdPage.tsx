"use client";

import { Box, Card, CardContent, CardHeader, Stack } from "@mui/material";
import { useState } from "react";
import { ErrorUI } from "../../../../../components/Error";
import { Loading } from "../../../../../components/Loading";
import QuoteProductCard from "./QuoteProductCard";
import QuoteDetails from "./QuoteDetails";
import { STEPS } from "../../../../../constants/quotes/status";
import { StatusLogList } from "./StatusLogList";
import { useStatusLogs } from "../../../../../hooks/logs/useStatusLogs";
import { useQuote, useUpdateQuoteStatus } from "../../../../../hooks/quotes";
import QuoteMessages from "../../../../../components/QuoteMessages";
import { buildTableHtml, escapeHtml, openPrintWindow } from "../../../../../utils/print";
import { statusLabelMap } from "../../../../../helpers/quotes";
import type { QuoteStatus } from "../../../../../types/quote";

interface QuoteIdProps {
  quoteId: string;
}

export const QuoteId = ({ quoteId }: QuoteIdProps) => {
  const [justSavedIdx, setJustSavedIdx] = useState<number | null>(null);

  const { data: quote, isLoading, isError } = useQuote(quoteId);
  const statusMutation = useUpdateQuoteStatus(quoteId);
  const { logs: statusLogs, loading: logsLoading, appendLog } = useStatusLogs(quoteId);

  const handleCall = () => {
    window.location.href = `tel: ${quote?.User?.phoneNumber}`;
  };

  const handleEmail = () => {
    window.location.href = `mailto:${
      quote?.User?.email
    }?subject=${encodeURIComponent("Cotización")}&body=${encodeURIComponent(
      `Hola ${quote?.User?.firstName}`
    )}`;
  };

  const handlePrint = () => {
    if (!quote) return;

    const headerRows = [
      ["# Orden", quote.orderNumber ?? quote.order ?? ""],
      ["Cliente", `${quote?.User?.firstName ?? ""} ${quote?.User?.lastName ?? ""}`.trim()],
      ["Fecha", new Date(quote?.createdAt).toLocaleString("es-MX")],
      ["Estado", statusLabelMap[quote?.status] ?? quote?.status ?? ""],
    ];

    const headerTable = buildTableHtml({
      caption: "Detalle de cotización",
      headers: ["Campo", "Valor"],
      rows: headerRows.map(
        ([k, v]) => `<tr><td>${escapeHtml(k)}</td><td>${escapeHtml(v)}</td></tr>`
      ),
    });

    const productHeaders = ["Producto", "Marca", "SKU", "Cantidad"];
    const productRows = (quote?.Products ?? []).map(
      (p) =>
        `<tr>
        <td>${escapeHtml(p?.name)}</td>
        <td>${escapeHtml(p?.brand?.name)}</td>
        <td>${escapeHtml(p?.code)}</td>
        <td>${escapeHtml(p?.QuoteProduct?.quantity)}</td>
      </tr>`
    );

    const productsTable = buildTableHtml({
      caption: "Productos",
      headers: productHeaders,
      rows: productRows,
    });

    openPrintWindow(`${headerTable}<br/>${productsTable}`, {
      title: `Cotización ${quote.orderNumber ?? ""}`,
    });
  };

  const handleSaveStatus = async (newStatus: QuoteStatus) => {
    const oldStatus = quote.status;

    await statusMutation.mutateAsync({
      status: newStatus,
      updatedAt: quote.updatedAt,
    });

    const idx = STEPS.findIndex((s) => s.value === newStatus);
    setJustSavedIdx(idx);

    await appendLog(quoteId, {
      oldStatus,
      newStatus,
      changedAt: new Date().toISOString(),
    });

    setTimeout(() => setJustSavedIdx(null), 800);
  };

  if (isError) {
    return <ErrorUI message="Error cargando los detalles de la cotización" />;
  }

  if (isLoading) return <Loading />;

  if (!quote) {
    return <ErrorUI message="No se encontró la cotización solicitada." />;
  }

  return (
    <Stack gap={2}>
      <QuoteDetails
        quote={quote}
        justSavedIdx={justSavedIdx}
        saving={statusMutation.isPending}
        onCall={handleCall}
        onEmail={handleEmail}
        onSave={handleSaveStatus}
        onPrint={handlePrint}
      />
      <StatusLogList logs={statusLogs} loading={logsLoading} />

      <Card variant="outlined" sx={{ p: 1 }}>
        <CardHeader title="Productos Cotizados" />
        <CardContent sx={{ pt: 0 }}>
          <Box
            sx={{
              display: "grid",
              gap: 2,
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            }}
          >
            {quote?.Products?.map((product) => (
              <QuoteProductCard key={product.id} product={product} />
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* Sistema de mensajes */}
      <Card variant="outlined" sx={{ p: 2 }}>
        <CardHeader title="Mensajes" />
        <CardContent>
          <QuoteMessages quoteId={quoteId} />
        </CardContent>
      </Card>
    </Stack>
  );
};
