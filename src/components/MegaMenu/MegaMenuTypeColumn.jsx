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
import Link from "next/link";
import { toCapitalizeWords, toSlug } from "../../utils/cases";

const MegaMenuTypeColumn = ({ types, onClose, loading }) => {
  if (loading) {
    return (
      <Box sx={{ minWidth: 200, px: 2, py: 1.5 }}>
        <Skeleton variant="text" width={100} height={24} sx={{ mb: 1 }} />
        <Stack spacing={0.5}>
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} variant="text" width="100%" height={32} />
          ))}
        </Stack>
      </Box>
    );
  }

  if (types.length === 0) {
    return (
      <Box
        sx={{
          minWidth: 200,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: 2,
        }}
      >
        <Typography variant="body2" color="text.disabled">
          Sin tipos
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ minWidth: 200, maxHeight: "60vh", overflowY: "auto" }}>
      <Typography
        variant="subtitle2"
        fontWeight={700}
        sx={{ px: 2, py: 1.5, color: "text.secondary" }}
      >
        Tipos
      </Typography>
      <List disablePadding dense>
        {types.map((type) => (
          <ListItemButton
            key={type.id}
            component={Link}
            href={`/types/${toSlug(type.name)}?id=${type.id}`}
            onClick={onClose}
            sx={{
              py: 1,
              px: 2,
              "&:hover": {
                backgroundColor: "grey.100",
              },
            }}
          >
            <ListItemText
              primary={toCapitalizeWords(type.name)}
              primaryTypographyProps={{ fontSize: 14 }}
            />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
};

export default MegaMenuTypeColumn;
