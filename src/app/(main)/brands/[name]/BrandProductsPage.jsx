"use client";

import { useEffect, useState } from "react";
import { Grid, Typography } from "@mui/material";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { ErrorUI } from "../../../../components/Error";
import { Loading } from "../../../../components/Loading";
import { getProductsByBrand } from "../../../../api/products";
import { toCapitalizeFirstLetter, toSlug } from "../../../../utils/cases";
import { ProductCard } from "../../../../components/ProductCard";
import NoProductsUI from "../../../../components/NoProducts";
import Pagination from "../../../../components/Pagination";
import BreadcrumbsNavigation from "../../../../components/BreadcrumbsNavigation";

const BrandProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [size] = useState(10);

  const { name } = useParams();
  const searchParams = useSearchParams();
  const brandId = searchParams.get("id");

  const breadcrumbItems = [
    { label: "Inicio", path: "/" },
    {
      label: toCapitalizeFirstLetter(name),
      path: `/brands/${toSlug(name)}?id=${brandId}`,
    },
  ];

  const fetchProducts = async (page = 1) => {
    setLoading(true);
    try {
      const { products, totalPages } = await getProductsByBrand(
        brandId,
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

  useEffect(() => {
    if (name && brandId) {
      fetchProducts(currentPage);
    }
  }, [name, brandId, currentPage]);

  const router = useRouter();

  const handleProductClick = (id) => {
    router.push(`/product/${id}`);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    fetchProducts(newPage);
  };

  if (loading) {
    return <Loading />;
  }

  if (error) return <ErrorUI main />;

  if (products.length === 0)
    return <NoProductsUI config={{ type: "marca", types: "marcas" }} />;

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
      <Grid item xs={12}>
        <BreadcrumbsNavigation items={breadcrumbItems} />
        <Typography
          component="h1"
          variant="h1"
          mt={{
            xs: 1,
            md: 2,
          }}
          mb={{
            xs: 1,
            md: 2,
          }}
        >
          Productos {toCapitalizeFirstLetter(name)}
        </Typography>
      </Grid>
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

export default BrandProductsPage;
