"use client";

import { Email, Phone } from "@mui/icons-material";
import { Box, Button, Grid, Typography } from "@mui/material";
import Image from "next/image";
import { useEffect, useState } from "react";
import { fetchQuoteById } from "../../../../../api/quote";
import { ErrorUI } from "../../../../../components/Error";
import { Loading } from "../../../../../components/Loading";
import { formatDateDayAbrev } from "../../../../../utils/date";

export const QuoteId = ({ quoteId }) => {
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

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

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Detalles de la Cotización
      </Typography>
      <Box sx={{ mb: 3 }}>
        <Typography variant="body1">
          <strong>Cliente:</strong> {quote?.User?.firstName}{" "}
          {quote?.User?.lastName}
        </Typography>
        <Typography variant="body1">
          <strong>Email:</strong> {quote?.User?.email}
        </Typography>
        <Typography variant="body1">
          <strong>Teléfono:</strong> {quote?.User?.phoneNumber}
        </Typography>
        <Typography variant="body1">
          <strong>Fecha:</strong> {formatDateDayAbrev(quote?.createdAt)}
        </Typography>
        <Typography variant="body1">
          <strong>Mensaje:</strong> {quote?.message}
        </Typography>

        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12} sm={6}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleCall}
              startIcon={<Phone />}
              fullWidth
            >
              Llamar
            </Button>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleEmail}
              startIcon={<Email />}
              fullWidth
            >
              Correo
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Typography variant="h6" sx={{ mb: 2 }}>
        Productos
      </Typography>

      {quote.Products.map((product) => (
        <Box
          key={product.id}
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 2,
            borderBottom: "1px solid #ddd",
            pb: 2,
          }}
          gap={2}
        >
          <Image
            src={product.Files && product.Files[0]?.path}
            alt={product.name}
            width={80}
            height={80}
            style={{ marginRight: 8, objectFit: "contain" }}
          />
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1">{product.name}</Typography>
            <Typography variant="body3" color="text.secondary">
              {product.code}
            </Typography>

            <Box sx={{ mt: 1 }}>
              <Typography>
                <strong>Cantidad:</strong> {product.QuoteProduct?.quantity}
              </Typography>
            </Box>
          </Box>
        </Box>
      ))}
    </Box>
  );
};
