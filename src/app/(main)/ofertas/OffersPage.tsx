"use client";

import { useCallback, useEffect, useState } from "react";
import { Box, Stack, Typography } from "@mui/material";
import { ProductCard } from "../../../components/ProductCard";
import FilterSelect from "../../../components/FilterSelect";
import Pagination from "../../../components/Pagination";
import { Loading } from "../../../components/Loading";
import { ErrorUI } from "../../../components/Error";
import ActivePromotionsBanner from "../../../components/ActivePromotionsBanner";
import { getPromotionProducts } from "../../../api/promotions";
import { PROMOTION_TYPE_OPTIONS } from "../../../constants/promotions";

const PAGE_SIZE = 20;
const TYPE_FILTERS = [{ value: "", label: "Todas" }, ...PROMOTION_TYPE_OPTIONS];

const OffersPage = () => {
  const [typeFilter, setTypeFilter] = useState("");
  const [items, setItems] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchPage = useCallback(
    async (pageToLoad: number) => {
      setLoading(true);
      setError(false);
      try {
        const res = await getPromotionProducts(pageToLoad, PAGE_SIZE, typeFilter || undefined);
        setTotal(res.total ?? 0);
        setPage(pageToLoad);
        setItems(res.products ?? []);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    },
    [typeFilter]
  );

  useEffect(() => {
    fetchPage(1);
  }, [fetchPage]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  const handlePageChange = (next: number) => {
    fetchPage(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
          <ErrorUI onRetry={() => fetchPage(page)} message="No pudimos cargar las ofertas" />
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
            {totalPages > 1 && (
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </Box>
    </>
  );
};

export default OffersPage;
