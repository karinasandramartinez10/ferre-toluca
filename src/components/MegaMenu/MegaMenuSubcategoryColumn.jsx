"use client";

import {
  Box,
  List,
  ListItemButton,
  ListItemText,
  Typography,
  Skeleton,
  Stack,
} from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Link from "next/link";
import { toCapitalizeWords, toSlug } from "../../utils/cases";

const MegaMenuSubcategoryColumn = ({
  subcategories,
  activeSubcategoryId,
  subcategoriesWithTypes = new Set(),
  onHover,
  onClose,
  loading,
}) => {
  if (loading) {
    return (
      <Box sx={{ minWidth: 220, px: 2, py: 1.5 }}>
        <Skeleton variant="text" width={120} height={24} sx={{ mb: 1 }} />
        <Stack spacing={0.5}>
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} variant="text" width="100%" height={32} />
          ))}
        </Stack>
      </Box>
    );
  }

  if (subcategories.length === 0) {
    return (
      <Box
        sx={{
          minWidth: 220,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: 2,
        }}
      >
        <Typography variant="body2" color="text.disabled">
          Sin subcategorías
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ minWidth: 220, maxHeight: "60vh", overflowY: "auto" }}>
      <Typography
        variant="subtitle2"
        fontWeight={700}
        sx={{ px: 2, py: 1.5, color: "text.secondary" }}
      >
        Subcategorías
      </Typography>
      <List disablePadding dense>
        {subcategories.map((sub) => (
          <ListItemButton
            key={sub.id}
            component={Link}
            href={`/subcategories/${toSlug(sub.name)}?id=${sub.id}`}
            onClick={onClose}
            onMouseEnter={() => onHover(sub.id)}
            selected={activeSubcategoryId === sub.id}
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
            <ListItemText
              primary={toCapitalizeWords(sub.name)}
              primaryTypographyProps={{ fontSize: 14 }}
            />
            {subcategoriesWithTypes.has(sub.id) && (
              <ChevronRightIcon
                fontSize="small"
                color={activeSubcategoryId === sub.id ? "primary" : "action"}
              />
            )}
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
};

export default MegaMenuSubcategoryColumn;
