import { Box, Chip, Tooltip } from "@mui/material";
import Link from "next/link";
import { toCapitalizeWords } from "../../utils/cases";

const NavigationLinks = ({ mainCategories = [] }) => {
  return (
    <Box
      sx={{
        display: { xs: "none", md: "flex" },
        gap: 1,
        paddingRight: 2,
        minWidth: 0,
      }}
    >
      <Tooltip title="Ofertas del mes" arrow>
        <Link href="/ofertas" passHref>
          <Chip
            label="Ofertas"
            clickable
            color="primary"
            sx={{
              fontWeight: 700,
              fontSize: "14px",
              borderRadius: "10px",
              paddingX: "8px",
              paddingY: "20px",
            }}
          />
        </Link>
      </Tooltip>
      {mainCategories.map((category) => {
        const label = toCapitalizeWords(category.name);
        return (
          <Tooltip key={category.name} title={label} arrow>
            <Link href={`/categories/${category.path}?id=${category.id}`} passHref>
              <Chip
                label={label}
                clickable
                sx={(theme) => ({
                  fontWeight: 600,
                  fontSize: "14px",
                  borderRadius: "10px",
                  paddingX: "8px",
                  paddingY: "20px",
                  maxWidth: 120,
                  color: theme.palette.grey.text,
                  backgroundColor: theme.palette.grey[200],
                  "& .MuiChip-label": {
                    display: "block",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                  },
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
          </Tooltip>
        );
      })}
    </Box>
  );
};

export default NavigationLinks;
