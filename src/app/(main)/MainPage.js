"use client";

import { Box, Button, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { ProductCard } from "../../components/ProductCard";
import { fetchProducts } from "../../api/products";
import { Loading } from "../../components/Loading";
import { ErrorUI } from "../../components/Error";

export const MainPage = ({ session }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [size, _] = useState(10);
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const isAuthenticated = !!session?.user;
  const isAdmin = session?.user.role === "admin";

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const fetchedData = await fetchProducts(currentPage, size);
      if (fetchedData.error) {
        console.error(fetchedData.error);
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

  const productList = products.map((product, index) => (
    <Grid item xs={12} sm={4} md={4} key={index}>
      <ProductCard
        key={product.id}
        product={product}
        showQuoteButton={isAuthenticated}
        isAdmin={isAdmin}
      />
    </Grid>
  ));

  return (
    <>
      <Grid
        container
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 4, sm: 8, md: 12 }}
        sx={{ minHeight: "500px" }}
      >
        {productList}
      </Grid>
      {totalPages > 1 && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: 5,
            alignItems: "baseline",
          }}
        >
          <Button
            variant="contained"
            disabled={currentPage === 1}
            onClick={() => handlePageChange("prev")}
          >
            Página anterior
          </Button>
          <Typography sx={{ mx: 2 }}>
            Página {currentPage} de {totalPages}
          </Typography>
          <Button
            variant="contained"
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange("next")}
          >
            Página siguiente
          </Button>
        </Box>
      )}
    </>
  );
};
