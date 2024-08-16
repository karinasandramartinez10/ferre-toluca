"use client";

import { useEffect, useState } from "react";
import { Grid, Typography } from "@mui/material";
import { useParams, useSearchParams } from "next/navigation";
import { ErrorUI } from "../../../../components/Error";
import { Loading } from "../../../../components/Loading";
import { getProductsByBrand } from "../../../../api/products";
// import ProductGrid from "./ProductGrid";

const BrandProductsPage = ({ session }) => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const { name } = useParams();

  const searchParams = useSearchParams();
  const brandId = searchParams.get("id");

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const products = await getProductsByBrand(brandId);
        setProducts(products);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setError(true);
        console.error("Error fetching products:", error);
      }
    };

    if (name && brandId) {
      fetchProducts();
    }
  }, [name, brandId]);

  if (loading) {
    return <Loading />;
  }

  if (error) return <ErrorUI main />;

  return (
    <Grid container>
      <Typography component="h1" variant="h1">
        Productos para {name}
      </Typography>
      {/* <ProductGrid products={products} /> */}
    </Grid>
  );
};

export default BrandProductsPage;
