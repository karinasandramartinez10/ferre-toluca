"use client";

import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { fetchQuoteById, updateQuote } from "../../../../../api/quote";
import { ErrorUI } from "../../../../../components/Error";
import { Loading } from "../../../../../components/Loading";
import QuoteProductCard from "./QuoteProductCard";
import QuoteDetails from "./QuoteDetails";
import { useSession } from "next-auth/react";

export const QuoteId = ({ quoteId }) => {
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingRead, setLoadingRead] = useState(false);
  const [error, setError] = useState(false);
  const [isRead, setIsRead] = useState(false);

  const { data } = useSession();

  useEffect(() => {
    if (quoteId) {
      const fetchData = async () => {
        try {
          setLoading(true);
          const fetchedQuote = await fetchQuoteById(
            quoteId,
            data.user.access_token
          );
          setQuote(fetchedQuote);
          setIsRead(fetchedQuote.isRead);
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
    return null;
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
      setLoadingRead(true);
      const resp = await updateQuote(
        quoteId,
        { isRead: true },
        data.user.access_token
      );
      if (resp.status === 200) {
        setIsRead(true);
      }
      setLoadingRead(false);
    } catch (error) {
      setLoadingRead(false);
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
        isRead={isRead}
        loading={loadingRead}
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
