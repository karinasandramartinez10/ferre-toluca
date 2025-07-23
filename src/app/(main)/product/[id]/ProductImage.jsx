import { CldImage } from "next-cloudinary";

const ProductImage = ({ name, publicId, width = 300, heightFactor = 4 }) => {
  const HEIGHT = Math.round((width * heightFactor) / 4);
  return (
    <CldImage
      src={publicId}
      alt={name}
      width={width}
      height={HEIGHT}
      crop="pad"
      quality="auto"
      format="auto"
      priority
      fetchPriority="high"
      decoding="async"
      loading="eager"
      style={{
        display: "block",
        margin: "0 auto",
        objectFit: "contain",
        maxWidth: "100%",
        height: "auto",
        borderRadius: "12px",
      }}
      sizes="
        (max-width: 600px) 100vw,
        (max-width: 960px) 50vw,
        (max-width: 1280px) 33vw,
        (max-width: 1650px) 25vw,
        20vw
      "
    />
  );
};

export default ProductImage;
