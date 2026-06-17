"use client";

import { useState } from "react";
import { Box, Breadcrumbs, Link as MuiLink, Stack, Typography } from "@mui/material";
import { ArrowBack, FolderOutlined } from "@mui/icons-material";
import { AnimatePresence, motion } from "framer-motion";
import { toCapitalizeWords } from "../../../../utils/cases";
import Categories from "./Categories";
import Subcategories from "./Subcategories";
import ProductTypes from "./ProductType";

const Crumb = ({ label, current, onClick }) => {
  const content = (
    <>
      <FolderOutlined sx={{ color: "secondary.main", fontSize: 15 }} />
      <Box
        component="span"
        sx={{
          maxWidth: { xs: 110, sm: 200 },
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </Box>
    </>
  );

  const sx = {
    display: "inline-flex",
    alignItems: "center",
    gap: 0.5,
    fontSize: "0.8rem",
    lineHeight: 1,
  };

  if (current) {
    return (
      <Typography color="text.primary" fontWeight={600} sx={sx}>
        {content}
      </Typography>
    );
  }

  return (
    <MuiLink
      component="button"
      type="button"
      onClick={onClick}
      underline="hover"
      color="primary.main"
      sx={sx}
    >
      {content}
    </MuiLink>
  );
};

const TaxonomyDrilldown = () => {
  const [path, setPath] = useState([]); // [] | [cat] | [cat, sub]
  const level = path.length;

  const goRoot = () => setPath([]);
  const goCategory = () => setPath((prev) => prev.slice(0, 1));
  const goBack = () => setPath((prev) => prev.slice(0, -1));

  return (
    <Box>
      <Stack
        direction="row"
        alignItems="center"
        spacing={1.5}
        sx={{ mb: 2, flexWrap: "wrap", rowGap: 1 }}
      >
        {level > 0 && (
          <MuiLink
            component="button"
            type="button"
            onClick={goBack}
            underline="hover"
            color="text.secondary"
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 0.25,
              fontSize: "0.8rem",
              flexShrink: 0,
            }}
          >
            <ArrowBack sx={{ fontSize: 16 }} />
            Volver
          </MuiLink>
        )}

        <Breadcrumbs
          separator="›"
          aria-label="Navegación de clasificación"
          sx={{
            fontSize: "0.8rem",
            "& .MuiBreadcrumbs-li": { display: "flex", alignItems: "center" },
            "& .MuiBreadcrumbs-separator": {
              mx: 0.5,
              fontSize: "1rem",
              lineHeight: 1,
              color: "text.disabled",
            },
          }}
        >
          <Crumb label="Categorías" current={level === 0} onClick={goRoot} />
          {path[0] && (
            <Crumb
              label={toCapitalizeWords(path[0].name)}
              current={level === 1}
              onClick={goCategory}
            />
          )}
          {path[1] && <Crumb label={toCapitalizeWords(path[1].name)} current />}
        </Breadcrumbs>
      </Stack>

      <AnimatePresence mode="wait">
        <motion.div
          key={path.map((p) => p.id).join("/") || "root"}
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -8 }}
          transition={{ duration: 0.18 }}
        >
          {level === 0 && (
            <Categories onDrill={(cat) => setPath([{ id: cat.id, name: cat.name }])} />
          )}
          {level === 1 && (
            <Subcategories
              parentId={path[0].id}
              parentName={path[0].name}
              onDrill={(sub) => setPath([path[0], { id: sub.id, name: sub.name }])}
            />
          )}
          {level === 2 && <ProductTypes parentId={path[1].id} parentName={path[1].name} />}
        </motion.div>
      </AnimatePresence>
    </Box>
  );
};

export default TaxonomyDrilldown;
