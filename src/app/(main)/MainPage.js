"use client";

import { Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { getBrands } from "../../api/brand";
import { Loading } from "../../components/Loading";
import { ErrorUI } from "../../components/Error";
import BrandCarousel from "./BrandCarousel";

export const MainPage = ({ session }) => {
  const [brands, setBrands] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const brandsData = await getBrands();
        setBrands(brandsData);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setError(true);
        console.error("Error fetching initial data:", error);
      }
    };

    fetchInitialData();
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (error) return <ErrorUI main />;

  return (
    <Grid
      container
      rowGap={{ 
        xs: 1,
        md: 0
      }}
      sx={{
        paddingLeft: { xs: "16px", md: "32px" },
        paddingRight: { xs: "16px", md: "32px" },
      }}
    >
      <Typography component="h1" variant="h1">
        Marcas
      </Typography>
      <BrandCarousel brands={brands} />
    </Grid>
  );
};
