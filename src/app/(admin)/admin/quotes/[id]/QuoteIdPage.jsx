"use client";

import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { fetchQuoteById, updateQuote } from "../../../../../api/quote";
import { ErrorUI } from "../../../../../components/Error";
import { Loading } from "../../../../../components/Loading";
import QuoteProductCard from "./QuoteProductCard";
import QuoteDetails from "./QuoteDetails";
import { useSnackbar } from "notistack";

export const QuoteId = ({ quoteId }) => {
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingRead, setLoadingRead] = useState(false);
  const [error, setError] = useState(false);
  const [isRead, setIsRead] = useState(false);

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (!quoteId) return;
  
    const fetchData = async () => {
      setLoading(true);
      try {
        const fetchedQuote = await fetchQuoteById(quoteId);
        if (!fetchedQuote) {
          throw new Error("Cotización no encontrada");
        }
        setQuote(fetchedQuote);
        setIsRead(fetchedQuote.isRead);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [quoteId]);

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
      const resp = await updateQuote(quoteOrderId, { isRead: true });
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

  if (error) {
    return <ErrorUI message="Error cargando los detalles de la cotización" />;
  }

  if (loading) return <Loading />;

if (!quote) {
  return (
    <ErrorUI message="No se encontró la cotización solicitada." />
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
