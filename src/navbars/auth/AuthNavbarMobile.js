import { Box } from "@mui/material";
import Image from "next/image";
import Link from "next/link";

export const AuthNavbarMobile = () => {
  return (
    <Box sx={{ display: { xs: "block", md: "none" } }}>
      <Link href="/">
        <Image
          src="/pexels-tools.jpg"
          alt="logo"
          width="50"
          height="50"
        />
      </Link>
    </Box>
  );
};
