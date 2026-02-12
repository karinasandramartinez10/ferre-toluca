"use client";

import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Link from "next/link";
import { getCategoryIcon } from "../../helpers/categories";
import { toCapitalizeWords } from "../../utils/cases";

const MegaMenuCategoryColumn = ({
  categories,
  activeCategoryId,
  categoriesWithSubs = new Set(),
  onHover,
  onClose,
}) => {
  return (
    <Box sx={{ minWidth: 240, maxHeight: "60vh", overflowY: "auto" }}>
      <Typography
        variant="subtitle2"
        fontWeight={700}
        sx={{ px: 2, py: 1.5, color: "text.secondary" }}
      >
        Categorías
      </Typography>
      <List disablePadding dense>
        {categories.map((category) => (
          <ListItemButton
            key={category.id}
            component={Link}
            href={`/categories/${category.path}?id=${category.id}`}
            onClick={onClose}
            onMouseEnter={() => onHover(category.id)}
            selected={activeCategoryId === category.id}
            sx={{
              py: 1,
              px: 2,
              "&.Mui-selected": {
                backgroundColor: "grey.100",
              },
              "&:hover": {
                backgroundColor: "grey.100",
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 36 }}>
              {getCategoryIcon(category.path)}
            </ListItemIcon>
            <ListItemText
              primary={toCapitalizeWords(category.name)}
              primaryTypographyProps={{ fontSize: 14 }}
            />
            {categoriesWithSubs.has(category.id) && (
              <ChevronRightIcon
                fontSize="small"
                color={activeCategoryId === category.id ? "primary" : "action"}
              />
            )}
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
};

export default MegaMenuCategoryColumn;
