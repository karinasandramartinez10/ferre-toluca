"use client";

import {
  Card,
  CardContent,
  CardHeader,
  Stack,
  Typography,
  Box,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { useEffect, useState } from "react";
import QuoteMessages from "../../../../../../components/QuoteMessages";
import { fetchUserQuoteById } from "../../../../../../api/quote";
import { Loading } from "../../../../../../components/Loading";
import { ErrorUI } from "../../../../../../components/Error";
import QuoteProductCard from "../../../../../(admin)/admin/quotes/[id]/QuoteProductCard";
import { ExpandMore } from "@mui/icons-material";
import { QuoteStatusStepper } from "../QuoteStatusStepper";

export default function UserQuoteIdPage({ quoteId }) {
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!quoteId) return;
    const fetchData = async () => {
      setLoading(true);
      try {
        const fetchedQuote = await fetchUserQuoteById(quoteId);
        if (!fetchedQuote) throw new Error("Cotización no encontrada");
        setQuote(fetchedQuote);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [quoteId]);

  if (error) {
    return <ErrorUI message="Error cargando los detalles de la cotización" />;
  }
  if (loading) return <Loading />;
  if (!quote) {
    return <ErrorUI message="No se encontró la cotización solicitada." />;
  }

  return (
    <Grid container spacing={1} mt={0}>
      <Grid item xs={12}>
        <Stack gap={2}>
          {/* Detalles de la cotización + productos cotizados */}
          <Card variant="outlined" sx={{ p: 0 }}>
            <CardHeader
              title={
                <Box display="flex" gap={1} alignItems="center">
                  <Typography variant="h6" fontWeight={700}>
                    Cotización #{quote.orderNumber}
                  </Typography>
                </Box>
              }
              sx={{ paddingBottom: 0 }}
            />
            <CardContent sx={{ paddingTop: 0 }}>
              <QuoteStatusStepper status={quote.status} />
              <Accordion
                disableGutters
                defaultExpanded
                sx={{ boxShadow: "none", mb: 0 }}
              >
                <AccordionSummary
                  sx={{ margin: 0, padding: 0 }}
                  aria-controls="products-accordion-content"
                  id="products-accordion-header"
                  expandIcon={<ExpandMore />}
                >
                  <Typography variant="h6" fontWeight={700}>
                    Productos Cotizados
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ padding: 0 }}>
                  <Box
                    sx={{
                      display: "grid",
                      gap: 2,
                      gridTemplateColumns:
                        "repeat(auto-fill, minmax(300px, 1fr))",
                      maxHeight: { xs: "none", md: 350 },
                      overflowY: { xs: "visible", md: "auto" },
                    }}
                  >
                    {quote?.Products?.map((product) => (
                      <QuoteProductCard key={product.id} product={product} />
                    ))}
                  </Box>
                </AccordionDetails>
              </Accordion>
            </CardContent>
          </Card>
        </Stack>
      </Grid>
      {/* Mensajes (sistema de mensajería) */}
      <Grid item xs={12}>
        <Card variant="outlined" sx={{ p: 0 }}>
          <CardHeader title="Mensajes" sx={{ paddingBottom: 0 }} />
          <CardContent>
            <QuoteMessages quoteId={quoteId} />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
