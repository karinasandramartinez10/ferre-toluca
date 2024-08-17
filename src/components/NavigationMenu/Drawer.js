import Link from "next/link";
import { Close as CloseIcon } from "@mui/icons-material";
import { Box, Drawer, IconButton, List, ListItem, ListItemText, Typography } from "@mui/material";

const DrawerMenu = ({ drawerOpen, onToggle, categories = [] }) => {
  return (
    <Drawer anchor="left" open={drawerOpen} onClose={onToggle(false)}>
      <Box
        sx={{
          width: 250,
          backgroundColor: "#fff",
        }}
        role="presentation"
        onClick={onToggle(false)}
      >
        <Box
          sx={{
            paddingX: "16px",
            backgroundColor: "primary.main",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography color="secondary.light">Categorías</Typography>
          <IconButton
            size="large"
            edge="start"
            aria-label="menu"
            onClick={onToggle(false)}
            sx={{ color: "#FFF" }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <List>
          {categories.map((category) => (
            <ListItem button key={category.name}>
              <Link href={category.path} passHref>
                <ListItemText primary={category.name} sx={{ color: "black" }} />
              </Link>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default DrawerMenu;
