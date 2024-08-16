import { Card, CardMedia } from "@mui/material";

export const BannerCard = ({ height, src, onClick, alt = "brand-card" }) => {
  return (
    <Card
      onClick={onClick}
      sx={{
        height,
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 2,
        backgroundColor: "#fff",
        overflow: "hidden",
        cursor: "pointer",
        "&:hover .brand-image": {
          filter: "grayscale(0%) brightness(100%)",
        },
      }}
    >
      <CardMedia
        component="img"
        alt={alt}
        image={src}
        title={alt}
        className="brand-image"
        sx={{
          objectFit: "contain",
          height: "100%",
          width: "100%",
          filter: "grayscale(100%) brightness(80%)",
          transition: "filter 0.2s ease-in-out",
        }}
      />
    </Card>
  );
};
