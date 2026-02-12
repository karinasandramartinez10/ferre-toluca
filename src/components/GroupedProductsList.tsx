import { Grid, Typography } from "@mui/material";
import { Loading } from "./Loading";
import { ErrorUI } from "./Error";
import Pagination from "./Pagination";
import { ProductCard } from "./ProductCard";
import NoProductsUI from "./NoProducts";
import type { GroupedResult } from "../types/product";

interface GroupedProductsListProps {
  title?: string;
  groupedResult: GroupedResult;
  loading: boolean;
  error: string | null;
  currentPage: number;
  onPageChange: (page: number) => void;
  onProductClick: (id: string) => void;
  showBtns?: boolean;
}

const GroupedProductsList = ({
  title,
  groupedResult,
  loading,
  error,
  currentPage,
  onPageChange,
  onProductClick,
  showBtns = true,
}: GroupedProductsListProps) => {
  if (loading) return <Loading />;
  if (error) return <ErrorUI />;

  if (groupedResult.products.length === 0)
    return <NoProductsUI config={{ type: "búsqueda", types: "búsquedas" }} />;

  const productList = groupedResult.products.map((group, index) => {
    const representativeProduct = group.variants[0];
    return (
      <Grid item xs={12} sm={6} md={4} lg={3} key={`${group.variantGroupKey}-${index}`}>
        <ProductCard
          key={representativeProduct.id}
          product={representativeProduct}
          onViewMore={onProductClick}
          showBtns={showBtns}
        />
      </Grid>
    );
  });

  return (
    <Grid container>
      {title && (
        <Grid item xs={12}>
          <Typography component="h1" variant="h1" mb={2}>
            {title}
          </Typography>
        </Grid>
      )}
      <Grid container spacing={{ xs: 2, md: 3 }} sx={{ minHeight: "500px" }}>
        {productList}
      </Grid>
      {groupedResult.totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={groupedResult.totalPages}
          onPageChange={onPageChange}
        />
      )}
    </Grid>
  );
};

export default GroupedProductsList;
