"use client";

import { Grid, Typography } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { ProductCard } from "../../../components/ProductCard";
import { Loading } from "../../../components/Loading";
import { ErrorUI } from "../../../components/Error";
import { fetchProducts } from "../../../api/products";
import Pagination from "../../../components/Pagination";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const AllProductsPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [size, _] = useState(10);
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const { data: session } = useSession();

  const isAdmin =
    session?.user?.role === "admin" || session?.user?.role === "superadmin";

  const fetchData = useCallback(async (page) => {
    setLoading(true);
    try {
      const fetchedData = await fetchProducts(page, size);
      if (fetchedData.error) {
        setLoading(false);
        setError(fetchedData.error);
        return;
      }
      setLoading(false);
      setProducts(fetchedData.data.products);
      setTotalPages(fetchedData.data.totalPages);
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [size])

  useEffect(() => {
    fetchData(currentPage);
  }, [fetchData, currentPage]);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const router = useRouter();

  const handleProductClick = (id) => {
    router.push(`/product/${id}`);
  };

  if (loading) {
    return <Loading />;
  }

  if (error) return <ErrorUI />;

  if (products.length === 0)
    return (
      <Grid>
        <Typography textAlign="center" variant="h2">
          Aun no hemos agregado productos
        </Typography>
      </Grid>
    );

  const productList = products.map((product, index) => (
    <Grid item xs={12} sm={8} md={4} lg={3} key={index}>
      <ProductCard
        key={product.id}
        product={product}
        onViewMore={handleProductClick}
        showBtns={!isAdmin}
      />
    </Grid>
  ));

  return (
    <Grid container>
      <Grid item xs={12}>
        <Typography component="h1" variant="h1" mb={2}>
          Todos los productos
        </Typography>
      </Grid>
      <Grid container spacing={{ xs: 2, md: 2 }} sx={{ minHeight: "500px" }}>
        {productList}
      </Grid>
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </Grid>
  );
};

export default AllProductsPage;
