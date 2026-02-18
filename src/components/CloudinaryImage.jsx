"use client";

import { CldImage } from "next-cloudinary";
import Image from "next/image";

const PLACEHOLDER_SRC = "/images/placeholder.png";

export const CloudinaryImage = ({
  publicId,
  alt = "Sin imagen",
  width,
  height,
  fill,
  style,
  sizes,
  crop = "pad",
  quality = "auto",
  format = "auto",
  priority,
  fetchPriority,
  loading,
  decoding,
  ...rest
}) => {
  if (!publicId) {
    return (
      <Image
        src={PLACEHOLDER_SRC}
        alt={alt}
        {...(fill ? { fill: true } : { width: width || 100, height: height || 100 })}
        style={{ objectFit: "contain", ...style }}
      />
    );
  }

  return (
    <CldImage
      src={publicId}
      alt={alt}
      {...(fill ? { fill: true } : { width, height })}
      crop={crop}
      quality={quality}
      format={format}
      style={style}
      sizes={sizes}
      priority={priority}
      fetchPriority={fetchPriority}
      loading={loading}
      decoding={decoding}
      {...rest}
    />
  );
};
