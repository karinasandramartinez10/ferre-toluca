"use client";

import { Grid } from "@mui/material";
import { useRouter } from "next/navigation";
import { ErrorUI } from "../../../../../components/Error";
import { Loading } from "../../../../../components/Loading";
import { ProductCard } from "../../../../../components/ProductCard";
import { useFavorites } from "../../../../../hooks/favorites/useFavorites";

const Favorites = () => {
  const { favorites, error, loading } = useFavorites();

  const router = useRouter();

  const handleProductClick = (id) => {
    router.push(`/product/${id}`);
  };

  if (error) return <ErrorUI />;

  /*   if (favorites.length === 0)
    return (
      <Grid>
        <Typography textAlign="center" variant="h2">
          Aun no tienes productos favoritos
        </Typography>
      </Grid>
    ); */

  const favoritesList = favorites.map(({ product }, index) => (
    <Grid item xs={12} sm={8} md={4} lg={3} key={index}>
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
        {loading && <Loading />}
      </Grid>
      <Grid container spacing={{ xs: 2, md: 2 }} sx={{ minHeight: "500px" }}>
        {favoritesList}
      </Grid>
    </Grid>
  );
};

export default Favorites;
