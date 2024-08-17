import {
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from "@mui/icons-material";
import Link from "next/link";
import { Menu as MenuIcon } from "@mui/icons-material";

const DropdownAllCategories = ({
  anchorEl,
  categories = [],
  open,
  onOpen,
  onClose,
}) => {
  return (
    <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center" }}>
      <Box display="flex" sx={{ background: "#f67003" }}>
        <Box
          display="flex"
          alignItems="center"
          sx={{ paddingX: "8px", cursor: "pointer" }}
          onClick={onOpen}
        >
          <MenuIcon sx={{ color: "#FFF" }} />
          <Button
            disableRipple
            sx={{
              height: "46px",
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
            endIcon={
              open ? (
                <ExpandLessIcon sx={{ fontSize: "26px !important" }} />
              ) : (
                <ExpandMoreIcon sx={{ fontSize: "26px !important" }} />
              )
            }
          >
            Todas las categorías
          </Button>
        </Box>
      </Box>
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
