import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Slider from "react-slick";
import { BannerCard } from "../../components/BannerCard";

const NextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <ArrowForwardIos
      className={className}
      style={{ ...style, display: "block", color: "#FFF" }}
      onClick={onClick}
    />
  );
};

const PrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <ArrowBackIos
      className={className}
      style={{ ...style, display: "block", color: "#FFF" }}
      onClick={onClick}
    />
  );
};

const settings = (handleBeforeChange, handleAfterChange) => ({
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 6,
  slidesToScroll: 6,
  rows: 2,
  nextArrow: <NextArrow />,
  prevArrow: <PrevArrow />,
  beforeChange: handleBeforeChange,
  afterChange: handleAfterChange,
  responsive: [
    {
      breakpoint: 1280,
      settings: {
        slidesToShow: 6,
        slidesToScroll: 6,
        rows: 2,
      },
    },
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 5,
        slidesToScroll: 5,
        rows: 2,
      },
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 4,
        slidesToScroll: 4,
        rows: 2,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3,
        rows: 2,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
        rows: 2,
      },
    },
  ],
});

const BrandCarousel = ({ brands }) => {
  const [dragging, setDragging] = useState(false);
  const router = useRouter();

  const handleBeforeChange = () => setDragging(true);
  const handleAfterChange = () => setDragging(false);

  const handleBrandClick = (brandName, brandId) => {
    if (!dragging) {
      router.push(`/brands/${brandName}?id=${brandId}`);
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: "#AE2424",
        width: "100vw",
        position: "relative",
        left: "calc(-50vw + 50%)",
      }}
    >
      <Box
        sx={{
          maxWidth: "1440px",
          margin: "0 auto",
          paddingX: "40px",
          paddingTop: {
            md: "16px !important",
          },
          paddingBottom: {
            md: "32px !important",
          },
          ".slick-dots li button:before": {
            color: "#FFF",
          },
          ".slick-dots li.slick-active button:before": {
            color: "#FFF",
          },
        }}
      >
        <Typography
          component="h1"
          variant="h1"
          sx={{ color: "#FFF", marginBottom: "16px" }}
        >
          Marcas
        </Typography>
        <Slider {...settings(handleBeforeChange, handleAfterChange)}>
          {brands.map((brand, index) => (
            <Box key={index} mt={1} mb={2} pr={2}>
              <BannerCard
                height="120px"
                src={brand?.File.path}
                onClick={() => handleBrandClick(brand.codeName, brand.id)}
                alt={brand.name}
              />
            </Box>
          ))}
        </Slider>
      </Box>
    </Box>
  );
};

export default BrandCarousel;
