"use client";

import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { fetchQuoteById } from "../../../../../api/quote";
import { ErrorUI } from "../../../../../components/Error";
import { Loading } from "../../../../../components/Loading";
import QuoteProductCard from "./QuoteProductCard";
import QuoteDetails from "./QuoteDetails";

export const QuoteId = ({ quoteId }) => {
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [markingAsRead, setMarkingAsRead] = useState(false);

  useEffect(() => {
    if (quoteId) {
      const fetchData = async () => {
        try {
          setLoading(true);
          const fetchedQuote = await fetchQuoteById(quoteId);
          setQuote(fetchedQuote);
          setLoading(false);
        } catch (error) {
          setLoading(false);
          setError(true);
        }
      };

      fetchData();
    }
  }, [quoteId]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorUI />;
  }

  if (!quote) {
    return null; // O mostrar un mensaje de "No encontrado"
  }

  const handleCall = () => {
    window.location.href = "tel:" + quote?.User?.phoneNumber;
  };

  const handleEmail = () => {
    window.location.href = `mailto:${
      quote?.User?.email
    }?subject=${encodeURIComponent("Cotización")}&body=${encodeURIComponent(
      `Hola ${quote?.User?.firstName}`
    )}`;
  };

  const handleMarkAsRead = async () => {
    try {
      setMarkingAsRead(true);
      const newStatus = !quote.isRead;
      //   await updateQuoteReadStatus(quoteId, newStatus);
      setQuote((prev) => ({ ...prev, isRead: newStatus }));
      setMarkingAsRead(false);
    } catch (error) {
      setMarkingAsRead(false);
      console.error("Error updating read status", error);
    }
  };

  return (
    <Box component="div">
      <QuoteDetails
        quote={quote}
        handleCall={handleCall}
        handleEmail={handleEmail}
        handleMarkAsRead={handleMarkAsRead}
        markingAsRead={markingAsRead}
      />

      <Typography variant="h4" sx={{ mt: 2, mb: 2 }}>
        Productos
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
