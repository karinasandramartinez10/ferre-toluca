import {
  Box,
  Button,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from "@mui/icons-material";
import Link from "next/link";
import { Menu as MenuIcon } from "@mui/icons-material";
import { getCategoryIcon, trimCategoryName } from "../../helpers/categories";

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
        {categories.map((category) => {
          const { trimmedName, isTrimmed } = trimCategoryName(category.name);
          return (
            <MenuItem
              key={category.name}
              onClick={onClose}
              sx={{
                "&:hover .category-text": {
                  color: "#ea281a",
                },
                "&:hover .MuiSvgIcon-root": {
                  color: "#ea281a",
                },
              }}
            >
              <Link href={category.path} passHref>
                <Box display="flex" alignItems="center" gap={1}>
                  {getCategoryIcon(category.path)}
                  {isTrimmed ? (
                    <Tooltip title={category.name} enterDelay={1000}>
                      <Typography
                        className="category-text"
                        sx={{
                          color: "secondary.main",
                          textDecoration: "none",
                          fontSize: "14px",
                        }}
                      >
                        {trimmedName}
                      </Typography>
                    </Tooltip>
                  ) : (
                    <Typography
                      className="category-text"
                      sx={{
                        color: "secondary.main",
                        textDecoration: "none",
                        fontSize: "14px",
                      }}
                    >
                      {category.name}
                    </Typography>
                  )}
                </Box>
              </Link>
            </MenuItem>
          );
        })}
      </Menu>
    </Box>
  );
};

export default DropdownAllCategories;
