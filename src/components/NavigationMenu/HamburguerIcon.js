import { IconButton } from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";

const HamburguerIcon = ({ onToggle }) => {
  return (
    <IconButton
      edge="start"
      color="inherit"
      aria-label="menu"
      sx={{ display: { xs: "block", md: "none" }, marginLeft: 0 }}
      onClick={onToggle(true)}
    >
      <MenuIcon sx={{ color: "#FFF" }} />
    </IconButton>
  );
};

export default HamburguerIcon;
