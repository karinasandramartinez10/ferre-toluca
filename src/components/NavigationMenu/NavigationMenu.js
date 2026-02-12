"use client";

import { Box } from "@mui/material";
import NavigationLinks from "./NavigationLinks";
import MegaMenu from "../MegaMenu/MegaMenu";

export default function NavigationMenu({ categories }) {
  const mainCategories = categories.slice(0, 3);

  return (
    <Box
      component="section"
      sx={{
        paddingTop: { xs: "60px", sm: "70px" },
        paddingX: 2,
        marginTop: { xs: 2, md: 1 },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <MegaMenu categories={categories} />
        <NavigationLinks mainCategories={mainCategories} />
      </Box>
    </Box>
  );
}
