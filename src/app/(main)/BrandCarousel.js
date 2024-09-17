import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import { Box, Grid } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Slider from "react-slick";
import { BannerCard } from "../../components/BannerCard";

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
    <Grid
      item
      xs={12}
      sx={(theme) => ({
        paddingBottom: theme.spacing(2),
        paddingTop: {
          md: "8px !important",
        },
      })}
    >
      <Slider {...settings(handleBeforeChange, handleAfterChange)}>
        {brands.map((brand, index) => (
          <Box key={index} mt={1} mb={2} pr={2}>
            <BannerCard
              height="120px"
              src={`/images/${brand.codeName}.png`}
              onClick={() => handleBrandClick(brand.codeName, brand.id)}
              alt={brand.name}
            />
          </Box>
        ))}
      </Slider>
    </Grid>
  );
};

export default BrandCarousel;
