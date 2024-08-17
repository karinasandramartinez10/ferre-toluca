import { Box, Button, Menu, MenuItem, Typography } from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from "@mui/icons-material";
import Link from "next/link";

const DropdownAllCategories = ({
  anchorEl,
  categories = [],
  open,
  onOpen,
  onClose,
}) => {
  return (
    <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center" }}>
      <Button
        onClick={onOpen}
        sx={{
          height: "44px",
          color: "white",
          textTransform: "none",
          paddingX: 2,
          backgroundColor: "#f67003",
          borderRadius: 0,
          fontSize: "14px",
          fontWeight: 700,
          "&:hover": {
            backgroundColor: "#f67003",
          },
          display: "flex",
          justifyContent: "space-between",
        }}
        endIcon={open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      >
        Todas las Colecciones
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={onClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        PaperProps={{
          sx: {
            width: anchorEl ? anchorEl.clientWidth : undefined,
            left: "0 !important",
          },
        }}
      >
        {categories.map((category) => (
          <MenuItem key={category.name} onClick={onClose}>
            <Link href={category.path} passHref>
              <Typography
                sx={{
                  color: "#f67003",
                  textDecoration: "none",
                  fontSize: "14px",
                  "&:hover": {
                    color: "#ea281a",
                  },
                }}
              >
                {category.name}
              </Typography>
            </Link>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default DropdownAllCategories;
