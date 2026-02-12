"use client";

import {
  Box,
  Drawer,
  IconButton,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
} from "@mui/material";
import {
  Close as CloseIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from "@mui/icons-material";
import { useState } from "react";
import Link from "next/link";
import { getCategoryIcon } from "../../helpers/categories";
import { toCapitalizeWords, toSlug } from "../../utils/cases";

const SubcategoryItem = ({
  subcategory,
  types,
  hasTypes,
  onClose,
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <ListItemButton
        sx={{ pl: 6 }}
        onClick={() => {
          if (hasTypes) {
            setExpanded(!expanded);
          }
        }}
        component={!hasTypes ? Link : "div"}
        href={!hasTypes ? `/subcategories/${toSlug(subcategory.name)}?id=${subcategory.id}` : undefined}
        {...(!hasTypes && { onClick: onClose })}
      >
        <ListItemText
          primary={toCapitalizeWords(subcategory.name)}
          primaryTypographyProps={{ fontSize: 14 }}
        />
        {hasTypes && (
          expanded ? (
            <ExpandLessIcon fontSize="small" />
          ) : (
            <ExpandMoreIcon fontSize="small" />
          )
        )}
      </ListItemButton>

      {hasTypes && (
        <Collapse in={expanded}>
          <ListItemButton
            component={Link}
            href={`/subcategories/${toSlug(subcategory.name)}?id=${subcategory.id}`}
            onClick={onClose}
            sx={{ pl: 8 }}
          >
            <ListItemText
              primary={`Ver todo en ${toCapitalizeWords(subcategory.name)}`}
              primaryTypographyProps={{
                fontSize: 13,
                fontWeight: 600,
                color: "primary.main",
              }}
            />
          </ListItemButton>

          {types.map((type) => (
            <ListItemButton
              key={type.id}
              component={Link}
              href={`/types/${toSlug(type.name)}?id=${type.id}`}
              onClick={onClose}
              sx={{ pl: 8 }}
            >
              <ListItemText
                primary={toCapitalizeWords(type.name)}
                primaryTypographyProps={{ fontSize: 13 }}
              />
            </ListItemButton>
          ))}
        </Collapse>
      )}
    </>
  );
};

const CategoryItem = ({
  category,
  subcategories,
  hasSubs,
  subcategoriesWithTypes,
  typesBySubcategory,
  onClose,
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <ListItemButton
        onClick={() => {
          if (hasSubs) {
            setExpanded(!expanded);
          }
        }}
        component={!hasSubs ? Link : "div"}
        href={!hasSubs ? `/categories/${category.path}?id=${category.id}` : undefined}
        {...(!hasSubs && { onClick: onClose })}
        sx={{ py: 1.5 }}
      >
        <ListItemIcon sx={{ minWidth: 36 }}>
          {getCategoryIcon(category.path)}
        </ListItemIcon>
        <ListItemText
          primary={toCapitalizeWords(category.name)}
          primaryTypographyProps={{ fontSize: 14, fontWeight: 500 }}
        />
        {hasSubs && (
          expanded ? (
            <ExpandLessIcon fontSize="small" />
          ) : (
            <ExpandMoreIcon fontSize="small" />
          )
        )}
      </ListItemButton>

      {hasSubs && (
        <Collapse in={expanded}>
          <ListItemButton
            component={Link}
            href={`/categories/${category.path}?id=${category.id}`}
            onClick={onClose}
            sx={{ pl: 6 }}
          >
            <ListItemText
              primary={`Ver todo en ${toCapitalizeWords(category.name)}`}
              primaryTypographyProps={{
                fontSize: 13,
                fontWeight: 600,
                color: "primary.main",
              }}
            />
          </ListItemButton>

          {subcategories.map((sub) => (
            <SubcategoryItem
              key={sub.id}
              subcategory={sub}
              types={typesBySubcategory[sub.id] || []}
              hasTypes={subcategoriesWithTypes.has(sub.id)}
              onClose={onClose}
            />
          ))}
        </Collapse>
      )}
    </>
  );
};

const MegaMenuMobile = ({
  drawerOpen,
  onToggle,
  categories = [],
  subcategoriesByCategory = {},
  typesBySubcategory = {},
  categoriesWithSubs = new Set(),
  subcategoriesWithTypes = new Set(),
}) => {
  return (
    <Drawer anchor="left" open={drawerOpen} onClose={onToggle(false)}>
      <Box sx={{ width: 300, backgroundColor: "#fff", height: "100%" }}>
        <Box
          sx={{
            px: 2,
            backgroundColor: "primary.main",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography color="secondary.light" fontWeight={600}>
            Categorías
          </Typography>
          <IconButton
            size="large"
            edge="start"
            aria-label="cerrar menu"
            onClick={onToggle(false)}
            sx={{ color: "#FFF" }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <List disablePadding sx={{ overflowY: "auto" }}>
          {categories.map((category) => (
            <CategoryItem
              key={category.id}
              category={category}
              subcategories={subcategoriesByCategory[category.id] || []}
              hasSubs={categoriesWithSubs.has(category.id)}
              subcategoriesWithTypes={subcategoriesWithTypes}
              typesBySubcategory={typesBySubcategory}
              onClose={onToggle(false)}
            />
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default MegaMenuMobile;
