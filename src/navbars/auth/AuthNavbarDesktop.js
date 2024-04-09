import { Box } from "@mui/material";
import Image from "next/image";
import Link from "next/link";

export const AuthNavbarDesktop = () => {
  return (
    <>
      <Box sx={{ display: { xs: "none", md: "block" } }}>
        <Link href="/">
          <Image src="/pexels-tools.jpg" alt="logo" width="80" height="30" />
        </Link>
      </Box>
      <Box flex={1} sx={{ display: { xs: "none", md: "block" } }} />
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Box sx={{ display: { xs: "none", md: "block" } }}></Box>
      </Box>
    </>
  );
};
