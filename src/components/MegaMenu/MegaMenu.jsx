"use client";

import { useState } from "react";
import {
  Box,
  Button,
  IconButton,
  Popover,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { ExpandMore as ExpandMoreIcon } from "@mui/icons-material";
import { styled } from "@mui/system";
import useMegaMenuData from "./useMegaMenuData";
import MegaMenuDesktop from "./MegaMenuDesktop";
import MegaMenuMobile from "./MegaMenuMobile";

const TriggerButton = styled(Button)(({ theme }) => ({
  borderRadius: "10px",
  backgroundColor: theme.palette.grey.light,
  paddingLeft: "16px",
  paddingRight: "10px",
  color: theme.palette.grey.text,
  display: "flex",
  alignItems: "center",
  minWidth: "250px",
  textTransform: "none",
  fontWeight: 500,
  fontSize: "15px",
  justifyContent: "space-between",
  "&:hover": {
    backgroundColor: theme.palette.grey.hover,
  },
  boxShadow: "none",
  border: "none",
  transition: "background-color 0.2s ease",
  [theme.breakpoints.down("md")]: {
    minWidth: "unset",
    width: "100%",
  },
}));

const MegaMenu = ({ categories }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [anchorEl, setAnchorEl] = useState(null);
  const popoverOpen = Boolean(anchorEl);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const isOpen = isMobile ? drawerOpen : popoverOpen;

  const {
    categories: treeCategories,
    subcategories,
    types,
    loadingSubcategories,
    loadingTypes,
    activeCategoryId,
    activeSubcategoryId,
    categoriesWithSubs,
    subcategoriesWithTypes,
    subcategoriesByCategory,
    typesBySubcategory,
    selectCategory,
    selectSubcategory,
    reset,
  } = useMegaMenuData(isOpen, categories);

  // Usar categorías del tree (solo las que tienen productos) cuando están disponibles
  const menuCategories = treeCategories.length > 0 ? treeCategories : categories;

  const handleOpen = (event) => {
    if (isMobile) {
      setDrawerOpen(true);
    } else {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
    setDrawerOpen(false);
    reset();
  };

  const toggleDrawer = (open) => () => {
    if (!open) {
      handleClose();
    } else {
      setDrawerOpen(true);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        maxWidth: { xs: "100%", md: "350px" },
        width: "100%",
      }}
    >
      <TriggerButton onClick={handleOpen} fullWidth>
        <span>Categorías</span>
        <IconButton
          component="span"
          size="small"
          sx={(theme) => ({
            backgroundColor: isOpen ? theme.palette.grey.light : "#FFF",
            borderRadius: "50%",
            border: "1px solid #fcfcfc",
            padding: "2px",
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
            "&:hover": {
              backgroundColor: theme.palette.grey.hover,
            },
            color: "#13161b",
            ml: 1,
          })}
        >
          <ExpandMoreIcon
            sx={{
              transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s ease",
            }}
          />
        </IconButton>
      </TriggerButton>

      {/* Desktop: Popover */}
      {!isMobile && (
        <Popover
          open={popoverOpen}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          transformOrigin={{ vertical: "top", horizontal: "left" }}
          slotProps={{
            paper: {
              sx: {
                mt: 1,
                borderRadius: 2,
                boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.12)",
                maxWidth: "90vw",
              },
            },
          }}
        >
          <MegaMenuDesktop
            categories={menuCategories}
            subcategories={subcategories}
            types={types}
            loadingSubcategories={loadingSubcategories}
            loadingTypes={loadingTypes}
            activeCategoryId={activeCategoryId}
            activeSubcategoryId={activeSubcategoryId}
            categoriesWithSubs={categoriesWithSubs}
            subcategoriesWithTypes={subcategoriesWithTypes}
            onSelectCategory={selectCategory}
            onSelectSubcategory={selectSubcategory}
            onClose={handleClose}
          />
        </Popover>
      )}

      {/* Mobile: Drawer */}
      {isMobile && (
        <MegaMenuMobile
          drawerOpen={drawerOpen}
          onToggle={toggleDrawer}
          categories={menuCategories}
          subcategoriesByCategory={subcategoriesByCategory}
          typesBySubcategory={typesBySubcategory}
          categoriesWithSubs={categoriesWithSubs}
          subcategoriesWithTypes={subcategoriesWithTypes}
        />
      )}
    </Box>
  );
};

export default MegaMenu;
