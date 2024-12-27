const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
        port: ""
      },
      {
        protocol: "http",
        hostname: "res.cloudinary.com",
        pathname: "/**",
        port: ""
      },
    ],
  },
};

export default nextConfig;
