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

const settings = (handleBeforeChange, handleAfterChange, productCount) => ({
  dots: true,
  speed: 500,
  slidesToShow: productCount < 4 ? productCount : 4, // Si hay menos de 4, solo muestra esa cantidad
  slidesToScroll: productCount < 4 ? productCount : 4, // Ajusta cuántos productos avanza por cada slide
  infinite: productCount >= 4,
  nextArrow: productCount >= 4 ? <NextArrow /> : null, // Oculta flechas si hay menos de 4
  prevArrow: productCount >= 4 ? <PrevArrow /> : null,
  beforeChange: handleBeforeChange,
  afterChange: handleAfterChange,
  responsive: [
    {
      breakpoint: 1280,
      settings: {
        slidesToShow: productCount < 4 ? productCount : 4,
        slidesToScroll: productCount < 4 ? productCount : 4,
      },
    },
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: productCount < 4 ? productCount : 4,
        slidesToScroll: productCount < 4 ? productCount : 4,
      },
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: productCount < 3 ? productCount : 3,
        slidesToScroll: productCount < 3 ? productCount : 3,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: productCount < 2 ? productCount : 2,
        slidesToScroll: productCount < 2 ? productCount : 2,
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
      <Slider
        {...settings(handleBeforeChange, handleAfterChange, products.length)}
      >
        {products.map((product, i) => (
          <Box key={`${product.id} - ${i}`} mt={1} mb={2} pr={2}>
            <ProductCard
              key={product.id}
              product={product}
              onViewMore={handleProductClick}
              priority
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
