import { Box, Typography } from "@mui/material";
import Link from "next/link";

const NavigationLinks = ({ mainCategories = [] }) => {
  return (
    <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2, paddingRight: 2 }}>
      {mainCategories.map((category) => (
        <Link
          key={category.name}
          href={`/categories/${category.path}?id=${category.id}`}
          passHref
        >
          <Typography
            sx={{
              color: "white !important",
              fontWeight: "bold",
              textTransform: "none",
              fontSize: "14px",
              "&:hover": {
                color: "#ffcc00 !important",
              },
            }}
          >
            {category.name}
          </Typography>
        </Link>
      ))}
    </Box>
  );
};

export default NavigationLinks;
