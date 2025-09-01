import {
  Box,
  Select,
  MenuItem,
  InputBase,
  Tooltip,
  Typography,
  IconButton,
} from "@mui/material";
import { ExpandMore as ExpandMoreIcon } from "@mui/icons-material";
import { styled } from "@mui/system";
import { useState } from "react";
import { getCategoryIcon, trimCategoryName } from "../../helpers/categories";
import Link from "next/link";

const CustomSelect = styled(Select)(({ theme }) => ({
  borderRadius: "10px",
  backgroundColor: theme.palette.grey.light,
  paddingLeft: "16px",
  paddingRight: "10px",
  color: theme.palette.text.secondary,
  display: "flex",
  alignItems: "center",
  minWidth: "250px",
  "& .MuiSelect-icon": {
    display: "none",
  },
  "&:hover": {
    backgroundColor: theme.palette.grey.hover,
  },
  boxShadow: "none",
  border: "none",
  transition: "background-color 0.2s ease",
}));

function FilteredInput(props) {
  const { notched, ...rest } = props;
  return <InputBase {...rest} />;
}

export default function DropdownAllCategories({ categories, onClose }) {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [open, setOpen] = useState(false);

  const handleChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedCategory("");
  };

  return (
    <Box
      width="100%"
      sx={{
        display: "flex",
        alignItems: "center",
        maxWidth: { xs: "100%", md: "350px" },
      }}
    >
      <CustomSelect
        value={selectedCategory || ""}
        onChange={handleChange}
        displayEmpty
        open={open}
        onClose={handleClose}
        onOpen={handleOpen}
        IconComponent={() => (
          <IconButton
            sx={(theme) => ({
              backgroundColor: open ? theme.palette.grey.light : "#FFF",
              borderRadius: "50%",
              border: "1px solid ##fcfcfc",
              padding: "2px",
              boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
              "&:hover": {
                backgroundColor: theme.palette.grey.hover,
              },
              color: "#13161b",
            })}
            onClick={handleOpen}
          >
            <ExpandMoreIcon />
          </IconButton>
        )}
        input={
          <FilteredInput
            sx={(theme) => ({
              paddingY: "4px",
              paddingLeft: 2,
              fontSize: "15px",
              color: theme.palette.grey.text,
              fontWeight: 500,
              width: { xs: "100%", md: "auto" },
            })}
          />
        }
        renderValue={(selected) => {
          if (!selected || selected.length === 0) {
            return <span>Categorías</span>;
          }
          return selected;
        }}
      >
        {categories.map((category) => {
          const { trimmedName, isTrimmed } = trimCategoryName(category.name);
          return (
            <MenuItem
              key={category.name}
              onClick={onClose}
              sx={(theme) => ({
                "&.Mui-selected": {
                  backgroundColor: "transparent",
                  "&:hover": {
                    backgroundColor: theme.palette.grey.hover,
                  },
                },
                "&:hover .category-text": {
                  color: theme.palette.secondary.hover,
                },
                "&:hover .MuiSvgIcon-root": {
                  color: theme.palette.secondary.hover,
                },
              })}
            >
              <Link
                href={`/categories/${category.path}?id=${category.id}`}
                passHref
              >
                <Box display="flex" alignItems="center" gap={2}>
                  {getCategoryIcon(category.path)}
                  {isTrimmed ? (
                    <Tooltip title={category.name} enterDelay={1000}>
                      <Typography
                        className="category-text"
                        sx={{
                          color: "black",
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
                        color: "black",
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
      </CustomSelect>
    </Box>
  );
}
