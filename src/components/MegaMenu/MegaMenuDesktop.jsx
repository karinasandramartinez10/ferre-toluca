"use client";

import { Box, Divider } from "@mui/material";
import { useCallback, useRef } from "react";
import MegaMenuCategoryColumn from "./MegaMenuCategoryColumn";
import MegaMenuSubcategoryColumn from "./MegaMenuSubcategoryColumn";
import MegaMenuTypeColumn from "./MegaMenuTypeColumn";

const MegaMenuDesktop = ({
  categories,
  subcategories,
  types,
  loadingSubcategories,
  loadingTypes,
  activeCategoryId,
  activeSubcategoryId,
  categoriesWithSubs,
  subcategoriesWithTypes,
  onSelectCategory,
  onSelectSubcategory,
  onClose,
}) => {
  const categoryTimerRef = useRef(null);
  const subcategoryTimerRef = useRef(null);

  const handleCategoryHover = useCallback(
    (categoryId) => {
      clearTimeout(categoryTimerRef.current);
      clearTimeout(subcategoryTimerRef.current);
      categoryTimerRef.current = setTimeout(() => {
        onSelectCategory(categoryId);
      }, 150);
    },
    [onSelectCategory]
  );

  const handleSubcategoryHover = useCallback(
    (subcategoryId) => {
      clearTimeout(subcategoryTimerRef.current);
      subcategoryTimerRef.current = setTimeout(() => {
        onSelectSubcategory(subcategoryId);
      }, 150);
    },
    [onSelectSubcategory]
  );

  return (
    <Box sx={{ display: "flex", minHeight: 300 }}>
      <MegaMenuCategoryColumn
        categories={categories}
        activeCategoryId={activeCategoryId}
        categoriesWithSubs={categoriesWithSubs}
        onHover={handleCategoryHover}
        onClose={onClose}
      />

      {activeCategoryId && (
        <>
          <Divider orientation="vertical" flexItem />
          <MegaMenuSubcategoryColumn
            subcategories={subcategories}
            activeSubcategoryId={activeSubcategoryId}
            subcategoriesWithTypes={subcategoriesWithTypes}
            onHover={handleSubcategoryHover}
            onClose={onClose}
            loading={loadingSubcategories}
          />
        </>
      )}

      {activeSubcategoryId && subcategories.length > 0 && (
        <>
          <Divider orientation="vertical" flexItem />
          <MegaMenuTypeColumn
            types={types}
            onClose={onClose}
            loading={loadingTypes}
          />
        </>
      )}
    </Box>
  );
};

export default MegaMenuDesktop;
