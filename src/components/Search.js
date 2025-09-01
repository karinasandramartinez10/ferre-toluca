"use client";

import { useState, useEffect } from "react";
import { useDebounce } from "../hooks/use-debounce";
import { getGroupedProducts } from "../api/products";
import {
  Box,
  Paper,
  Popper,
  ClickAwayListener,
  Typography,
  IconButton,
} from "@mui/material";
import { useRouter } from "next/navigation";
import {
  ErrorSearch,
  LoadingIndicatorSearch,
  SearchInput,
  SearchList,
} from "./Search/SearchInputComponents";
import { Search } from "@mui/icons-material";

export default function SearchComponent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const router = useRouter();

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  useEffect(() => {
    const fetchProducts = async () => {
      if (debouncedSearchQuery.length >= 3) {
        setLoading(true);
        try {
          const { data } = await getGroupedProducts("groupedSearch", {
            q: debouncedSearchQuery,
            page: 1,
            size: 10,
          });
          setProducts(data.products);
          setLoading(false);
        } catch (err) {
          setError("Error al obtener productos");
          setLoading(false);
        }
      } else {
        setProducts([]);
        setLoading(false);
        setError(false);
      }
    };

    fetchProducts();
  }, [debouncedSearchQuery]);

  const handleClickAway = () => {
    setAnchorEl(null);
    setIsSearchVisible(false);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setAnchorEl(event.currentTarget);
  };

  const handleProductClick = (id) => {
    router.push(`/product/${id}`);
    handleClickAway();
  };

  const toggleSearchVisibility = () => {
    setIsSearchVisible((prevState) => !prevState);
  };

  const handleSearchSubmit = () => {
    if (debouncedSearchQuery.length >= 3) {
      router.push(`/search?q=${debouncedSearchQuery}`);
    }
  };

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Box sx={{ position: "relative", display: "flex", alignItems: "center" }}>
        {!isSearchVisible && (
          <IconButton
            sx={(theme) => ({
              display: { xs: "-webkit-inline-flex", md: "none" },
              color: theme.palette.grey.light,
            })}
            onClick={toggleSearchVisibility}
          >
            <Search />
          </IconButton>
        )}

        <Box
          sx={{
            display: {
              xs: isSearchVisible ? "block" : "none",
              md: "block",
            },
            maxWidth: { xs: "100%", md: "360px" },
            transition: "all 0.3s ease-in-out",
          }}
        >
          <SearchInput
            searchQuery={searchQuery}
            handleSearchChange={handleSearchChange}
            handleSearchSubmit={handleSearchSubmit}
          />
        </Box>
        <Popper
          open={Boolean(
            anchorEl &&
              (loading ||
                error ||
                products.length > 0 ||
                (!loading &&
                  !error &&
                  products.length === 0 &&
                  debouncedSearchQuery.length >= 3))
          )}
          anchorEl={anchorEl}
          placement="bottom-start"
          modifiers={[
            {
              name: "offset",
              options: {
                offset: [0, 8],
              },
            },
          ]}
          sx={{ zIndex: 9999 }}
        >
          <Paper
            sx={{
              maxHeight: "300px",
              overflowY: "auto",
              width: anchorEl ? anchorEl.clientWidth : undefined,
            }}
          >
            {loading && <LoadingIndicatorSearch />}
            {error && <ErrorSearch error={error} />}
            {!loading && !error && products.length > 0 && (
              <SearchList
                products={products}
                handleProductClick={handleProductClick}
              />
            )}
            {!loading &&
              !error &&
              products.length === 0 &&
              debouncedSearchQuery.length >= 3 && (
                <Box sx={{ p: 2, textAlign: "center" }}>
                  <Typography>No se encontraron productos</Typography>
                </Box>
              )}
          </Paper>
        </Popper>
      </Box>
    </ClickAwayListener>
  );
}
