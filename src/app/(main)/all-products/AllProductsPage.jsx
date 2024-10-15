"use client";

import { Box, Button, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { ProductCard } from "../../../components/ProductCard";
import { Loading } from "../../../components/Loading";
import { ErrorUI } from "../../../components/Error";
import { fetchProducts } from "../../../api/products";
import Pagination from "../../../components/Pagination";

const AllProductsPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [size, _] = useState(10);
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const fetchedData = await fetchProducts(currentPage, size);
      if (fetchedData.error) {
        setLoading(false);
        setError(fetchedData.error);
        return;
      }
      setLoading(false);
      setProducts(fetchedData.data.products);
      setTotalPages(fetchedData.data.totalPages);
    };

    fetchData();
  }, [currentPage]);

  const handlePageChange = (direction) => {
    if (direction === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else if (direction === "next" && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) return <ErrorUI main />;

  if (products.length === 0)
    return (
      <Grid>
        <Typography textAlign="center" variant="h2">
          Aun no hemos agregado productos
        </Typography>
      </Grid>
    );

  const productList = products.map((product, index) => (
    <Grid item xs={12} sm={4} md={4} key={index}>
      <ProductCard key={product.id} product={product} />
    </Grid>
  ));

  return (
    <Grid container>
      <Typography component="h1" variant="h1" mb={2}>
        Todos los productos
      </Typography>
      <Grid
        container
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 4, sm: 8, md: 12 }}
        sx={{ minHeight: "500px" }}
      >
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
