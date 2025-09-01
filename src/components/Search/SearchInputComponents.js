import { Search } from "@mui/icons-material";
import {
  Box,
  CircularProgress,
  IconButton,
  InputBase,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import Image from "next/image";

export const SearchInput = ({
  searchQuery,
  handleSearchChange,
  handleSearchSubmit,
}) => (
  <InputBase
    value={searchQuery}
    onChange={handleSearchChange}
    placeholder="Buscar..."
    sx={{
      borderRadius: "10px",
      backgroundColor: "#f1f1f1",
      paddingLeft: "16px",
      paddingRight: "8px",
      minWidth: { xs: "100%", md: "360px" },
      height: "40px",
      display: "flex",
      alignItems: "center",
      boxShadow: "0 2px 2px rgba(0,0,0,0.08)",
      transition: "box-shadow 0.2s ease",
      "&:hover": {
        boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
      },
      "&:focus-within": {
        boxShadow: "0 2px 8px rgba(0,0,0,0.14)",
      },
      border: "none",
    }}
    endAdornment={
      <IconButton sx={{ p: "10px" }} onClick={handleSearchSubmit}>
        <Search />
      </IconButton>
    }
  />
);

export const LoadingIndicatorSearch = () => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      p: 2,
    }}
  >
    <CircularProgress />
  </Box>
);

export const ErrorSearch = ({ error }) => (
  <Box sx={{ p: 2, textAlign: "center" }}>
    <Typography color="error">{error}</Typography>
  </Box>
);

export const SearchList = ({ products, handleProductClick }) => (
  <List>
    {products.map((group) => {
      const representativeProduct = group.variants[0];
      return (
        <ListItem
          button
          key={representativeProduct.id}
          onClick={() => handleProductClick(representativeProduct.id)}
        >
          <Box
            sx={{
              width: "50px",
              height: "50px",
              marginRight: "16px",
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            <Image
              src={
                representativeProduct.Files?.[0]?.path ??
                "/images/placeholder.png"
              }
              alt={representativeProduct.name}
              width={50}
              height={50}
              style={{ objectFit: "cover" }}
            />
          </Box>
          <ListItemText
            primary={representativeProduct.name}
            secondary={representativeProduct.code}
          />
        </ListItem>
      );
    })}
  </List>
);
