"use client";

import {
  Card,
  CardContent,
  CardHeader,
  Stack,
  Typography,
  Box,
  Grid,
  IconButton,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import QuoteMessages from "../../../../components/QuoteMessages";
import { useEffect, useState } from "react";
import { fetchUserQuoteById } from "../../../../api/quote";
import { Loading } from "../../../../components/Loading";
import { ErrorUI } from "../../../../components/Error";
import QuoteProductCard from "../../../(admin)/admin/quotes/[id]/QuoteProductCard";
import { STEPS } from "../../../../constants/quotes/status";
import {
  ArrowBackIosNewRounded,
  ExpandMore,
  InfoOutlined,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";

export default function UserQuoteIdPage({ quoteId }) {
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const router = useRouter();

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

  const stepObj = STEPS.find((s) => s.value === quote.status);
  const StatusIcon = stepObj?.Icon || InfoOutlined;

  return (
    <Grid container spacing={1} mt={0}>
      <Grid item xs={12}>
        <Stack gap={2}>
          <Box display="flex" gap={1} alignItems="center">
            <IconButton onClick={() => router.back()}>
              <ArrowBackIosNewRounded sx={{ color: "primary.main" }} />
            </IconButton>
            <Typography variant="h1">
              {`Detalle de la cotización #${quote.orderNumber}`}
            </Typography>
            <Chip
              icon={<StatusIcon />}
              label={stepObj?.label || quote.status}
              color="primary"
              sx={{ fontWeight: 700, fontSize: "1rem", height: 32 }}
            />
          </Box>
          {/* Detalles de la cotización + productos cotizados */}
          <Card variant="outlined" sx={{ p: 0 }}>
            <CardContent>
              <Accordion disableGutters defaultExpanded sx={{ boxShadow: "none", mb: 0 }}>
                <AccordionSummary
                  sx={{ margin: 0 }}
                  expandIcon={<ExpandMore />}
                >
                  <Typography variant="h6" fontWeight={700}>
                    Productos Cotizados
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
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
        <Card variant="outlined" sx={{ p: 2 }}>
          <CardHeader title="Mensajes" />
          <CardContent>
            <QuoteMessages quoteId={quoteId} />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
