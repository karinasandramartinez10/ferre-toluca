import { Box, Chip } from "@mui/material";
import Link from "next/link";

const NavigationLinks = ({ mainCategories = [] }) => {
  return (
    <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1, paddingRight: 2 }}>
      {mainCategories.map((category) => (
        <Link
          key={category.name}
          href={`/categories/${category.path}?id=${category.id}`}
          passHref
        >
          <Chip
            label={category.name}
            clickable
            sx={(theme) => ({
              fontWeight: 600,
              fontSize: "14px",
              borderRadius: "10px",
              paddingX: "8px",
              paddingY: "20px",
              color: theme.palette.grey.text,
              backgroundColor: theme.palette.grey[200],
              "&:hover": {
                backgroundColor: theme.palette.grey[300],
                color: theme.palette.secondary.hover,
              },
              "&:focus": {
                backgroundColor: theme.palette.primary.light,
                color: theme.palette.primary.contrastText,
              },
            })}
          />
        </Link>
      ))}
    </Box>
  );
};

export default NavigationLinks;