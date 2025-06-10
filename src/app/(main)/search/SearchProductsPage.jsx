"use client";

import { Grid, Typography } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import GroupedProductsList from "../../../components/GroupedProductsList";
import useGroupedProducts from "../../../hooks/grouped/useGroupedProducts";

const SearchProductsPage = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");
  const router = useRouter();

  const { groupedResult, loading, error, currentPage, setCurrentPage } =
    useGroupedProducts({ query, pageSize: 10 });

  const handleProductClick = (id) => {
    router.push(`/product/${id}`);
  };

  return (
    <Grid container>
      <Typography component="h1" variant="h1" mb={2}>
        Resultados para {query}
      </Typography>
      <GroupedProductsList
        groupedResult={groupedResult}
        loading={loading}
        error={error}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onProductClick={handleProductClick}
      />
    </Grid>
  );
};

export default SearchProductsPage;
