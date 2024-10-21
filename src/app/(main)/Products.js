import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import { Box, Button, Grid, Typography } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Slider from "react-slick";
import { ProductCard } from "../../components/ProductCard";

const NextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <ArrowForwardIos
      className={className}
      style={{ ...style, display: "block", color: "black" }}
      onClick={onClick}
    />
  );
};

const PrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <ArrowBackIos
      className={className}
      style={{ ...style, display: "block", color: "black" }}
      onClick={onClick}
    />
  );
};

const settings = (handleBeforeChange, handleAfterChange) => ({
  dots: true,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 4,
  nextArrow: <NextArrow />,
  prevArrow: <PrevArrow />,
  beforeChange: handleBeforeChange,
  afterChange: handleAfterChange,
  responsive: [
    {
      breakpoint: 1280,
      settings: {
        slidesToShow: 4,
        slidesToScroll: 4,
      },
    },
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 4,
        slidesToScroll: 4,
      },
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
});

const Products = ({ products }) => {
  const [_, setDragging] = useState(false);

  const handleBeforeChange = () => setDragging(true);
  const handleAfterChange = () => setDragging(false);

  const router = useRouter();

  const handleProductClick = (id) => {
    router.push(`/product/${id}`);
  };

  return (
    <Grid item xs={12} mt={2}>
      <Typography component="h1" variant="h1">
        Productos
      </Typography>
      <Slider {...settings(handleBeforeChange, handleAfterChange)}>
        {products.map((product, index) => (
          <Box key={index} mt={1} mb={2} pr={2}>
            <ProductCard
              key={product.id}
              product={product}
              onViewMore={handleProductClick}
            />
          </Box>
        ))}
      </Slider>
      <Box display="flex" justifyContent="center" pt={5}>
        <Button LinkComponent={Link} href="/all-products">
          Ver todos los productos
        </Button>
      </Box>
    </Grid>
  );
};

export default Products;
