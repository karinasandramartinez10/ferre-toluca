"use client";

import { useCallback, useEffect, useState } from "react";
import { Box, Stack, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { ProductCard } from "../../../components/ProductCard";
import FilterSelect from "../../../components/FilterSelect";
import { Loading } from "../../../components/Loading";
import { ErrorUI } from "../../../components/Error";
import ActivePromotionsBanner from "../../../components/ActivePromotionsBanner";
import { getPromotionProducts } from "../../../api/promotions";
import { PROMOTION_TYPE_OPTIONS } from "../../../constants/promotions";

const PAGE_SIZE = 20;
const TYPE_FILTERS = [{ value: "", label: "Todas" }, ...PROMOTION_TYPE_OPTIONS];

const OffersPage = () => {
  const [typeFilter, setTypeFilter] = useState("");
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(false);

  const fetchPage = useCallback(
    async (pageToLoad, append) => {
      append ? setLoadingMore(true) : setLoading(true);
      setError(false);
      try {
        const res = await getPromotionProducts(pageToLoad, PAGE_SIZE, typeFilter || undefined);
        setTotal(res.total ?? 0);
        setPage(pageToLoad);
        setItems((prev) => (append ? [...prev, ...(res.products ?? [])] : (res.products ?? [])));
      } catch {
        setError(true);
      } finally {
        append ? setLoadingMore(false) : setLoading(false);
      }
    },
    [typeFilter]
  );

  useEffect(() => {
    fetchPage(1, false);
  }, [fetchPage]);

  const hasMore = items.length < total;

  return (
    <>
      <ActivePromotionsBanner showViewAll={false} />
      <Box sx={{ maxWidth: "1440px", mx: "auto", px: { xs: 3, xl: 0 }, py: 3 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 2, flexWrap: "wrap", gap: 1 }}
        >
          <Typography variant="h1" sx={{ fontWeight: 800, fontFamily: "var(--font-montserrat)" }}>
            Ofertas del mes
          </Typography>
          <FilterSelect value={typeFilter} onChange={setTypeFilter} options={TYPE_FILTERS} />
        </Stack>

        {loading ? (
          <Loading />
        ) : error ? (
          <ErrorUI onRetry={() => fetchPage(1, false)} message="No pudimos cargar las ofertas" />
        ) : items.length === 0 ? (
          <Box sx={{ py: 8, textAlign: "center" }}>
            <Typography color="text.secondary">No hay ofertas activas por ahora</Typography>
          </Box>
        ) : (
          <>
            <Box
              sx={{
                display: "grid",
                gap: 2,
                gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              }}
            >
              {items.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </Box>
            {hasMore && (
              <Box sx={{ textAlign: "center", mt: 3 }}>
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
      </Box>
    </>
  );
};

export default OffersPage;
