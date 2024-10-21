import { Box, Button, IconButton, Typography } from "@mui/material";
import { ArrowBackIos, ArrowForwardIos, MoreHoriz } from "@mui/icons-material";
import { useMemo } from "react";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  const isLastPage = currentPage === totalPages;
  const isFirstPage = currentPage === 1;

  const handlePageClick = (page) => {
    if (page !== currentPage) {
      onPageChange(page);
    }
  };

  const commonButtonStyles = () => ({
    borderRadius: "20px",
    mx: 0.5,
    minWidth: "40px",
  });

  const activeButtonStyles = (theme) => ({
    backgroundColor: `${theme.palette.primary.main} !important`,
    color: "#FFF !important",
    ...commonButtonStyles(theme),
  });

  const inactiveButtonStyles = (theme) => ({
    backgroundColor: `${theme.palette.primary.light} !important`,
    "&:hover": {
      backgroundColor: `${theme.palette.primary.main} !important`,
    },
    ...commonButtonStyles(theme),
  });

  const renderPageButton = (page) => (
    <Button
      key={page}
      sx={page === currentPage ? activeButtonStyles : inactiveButtonStyles}
      onClick={() => handlePageClick(page)}
    >
      {page}
    </Button>
  );

  const renderEllipsis = (key) => (
    <Box display="flex" height="38px" alignItems="center" key={key}>
      <MoreHoriz
        sx={(theme) => ({
          mx: 0.5,
          color: `${theme.palette.primary.light} !important`,
        })}
      />
    </Box>
  );

  const renderPages = useMemo(() => {
    const pages = [];

    // Primera página
    pages.push(renderPageButton(1));

    // Puntos suspensivos antes de la página actual si es necesario
    if (currentPage > 3) {
      pages.push(renderEllipsis("left"));
    }

    // Páginas cercanas a la página actual
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      pages.push(renderPageButton(i));
    }

    // Puntos suspensivos después de la página actual si es necesario
    if (currentPage < totalPages - 2) {
      pages.push(renderEllipsis("right"));
    }

    // Última página
    if (totalPages > 1) {
      pages.push(renderPageButton(totalPages));
    }

    return pages;
  }, [currentPage, totalPages]);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        mt: 5,
        width: "100%",
      }}
    >
      <IconButton
        onClick={() => handlePageClick(currentPage - 1)}
        disabled={isFirstPage}
        sx={{
          color: isFirstPage ? "grey.400" : "primary.main",
          "&:hover": { color: "primary.dark", backgroundColor: "transparent" },
          display: "flex",
          alignItems: "center",
        }}
      >
        <ArrowBackIos fontSize="small" />
        <Typography sx={{ ml: 1 }}>Atras</Typography>
      </IconButton>

      {renderPages}

      <IconButton
        onClick={() => handlePageClick(currentPage + 1)}
        disabled={isLastPage}
        sx={{
          color: isLastPage ? "grey.400" : "primary.main",
          "&:hover": { color: "primary.dark", backgroundColor: "transparent" },
          display: "flex",
          alignItems: "center",
        }}
      >
        <Typography sx={{ mr: 1 }}>Adelante</Typography>
        <ArrowForwardIos fontSize="small" />
      </IconButton>
    </Box>
  );
}
