"use client";

import { Box, Typography } from "@mui/material";
import { useCallback, useState } from "react";
import { fetchQuoteById, updateQuote } from "../../../../../api/quote";
import { ErrorUI } from "../../../../../components/Error";
import { Loading } from "../../../../../components/Loading";
import QuoteProductCard from "./QuoteProductCard";
import QuoteDetails from "./QuoteDetails";
import { useSnackbar } from "notistack";

export const QuoteId = ({ initialData }) => {
  const [quote, setQuote] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [loadingRead, setLoadingRead] = useState(false);
  const [error, setError] = useState(false);
  const [isRead, setIsRead] = useState(initialData.isRead);

  const { enqueueSnackbar } = useSnackbar();

  const reload = useCallback(async () => {
    setError(false);
    setLoading(true);
    try {
      const fresh = await fetchQuoteById(initialData.id);
      setQuote(fresh);
      setIsRead(fresh.isRead);
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [initialData.id]);

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

  const handleMarkAsRead = async () => {
    setLoadingRead(true);
    try {
      const resp = await updateQuote(initialData.id, { isRead: true });
      if (resp.status === 200) {
        setIsRead(true);
      }
    } catch (error) {
      console.error("Error updating read status", error);
      enqueueSnackbar("Hubo un error al agregar el producto", {
        variant: "error",
        autoHideDuration: 5000,
        anchorOrigin: {
          vertical: "top",
          horizontal: "right",
        },
      });
    } finally {
      setLoadingRead(false);
    }
  };

  if (loading) return <Loading />;
  if (error) {
    return (
      <ErrorUI
        onRetry={reload}
        message="Error cargando los detalles de la cotización"
      />
    );
  }

  return (
    <Box component="div">
      <QuoteDetails
        quote={quote}
        onCall={handleCall}
        onEmail={handleEmail}
        onMarkAsRead={handleMarkAsRead}
        isRead={isRead}
        loadingRead={loadingRead}
      />

      <Typography variant="h4" sx={{ mt: 2, mb: 2 }}>
        Productos cotizados
      </Typography>
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
    </Box>
  );
};
