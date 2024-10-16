"use client";

import { useEffect, useState } from "react";
import { Grid, Typography } from "@mui/material";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { ErrorUI } from "../../../../components/Error";
import { Loading } from "../../../../components/Loading";
import NoProductsUI from "../../../../components/NoProducts";
import {
  toCapitalizeFirstLetter,
  transformCategoryPath,
} from "../../../../utils/cases";
import { getProductsByCategory } from "../../../../api/products";
import { ProductCard } from "../../../../components/ProductCard";
import Pagination from "../../../../components/Pagination";

const CategoryProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [size] = useState(10);

  const { name } = useParams();
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("id");

  const decodedName = decodeURIComponent(name);
  const formattedName = transformCategoryPath(decodedName);

  const router = useRouter();

  const handleProductClick = (id) => {
    router.push(`/product/${id}`);
  };

  useEffect(() => {
    const fetchProducts = async (page = 1) => {
      setLoading(true);
      try {
        const { products, totalPages } = await getProductsByCategory(
          categoryId,
          page,
          size
        );
        setProducts(products);
        setTotalPages(totalPages);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setError(true);
        console.error("Error fetching products:", error);
      }
    };

    if (name && categoryId) {
      fetchProducts(currentPage);
    }
  }, [name, categoryId, currentPage]);

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
    return <NoProductsUI config={{ type: "categoría", types: "categorías" }} />;

  const productList = products.map((product, index) => (
    <Grid item xs={12} sm={4} md={4} key={index}>
      <ProductCard
        key={product.id}
        product={product}
        onViewMore={handleProductClick}
      />
    </Grid>
  ));

  return (
    <Grid container>
      <Typography component="h1" variant="h1" mb={2}>
        {toCapitalizeFirstLetter(formattedName)}
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

export default CategoryProductsPage;
