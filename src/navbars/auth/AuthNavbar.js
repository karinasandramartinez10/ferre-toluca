import { AppBar, Toolbar } from "@mui/material";
import { AuthNavbarDesktop } from "./AuthNavbarDesktop";
import { AuthNavbarMobile } from "./AuthNavbarMobile";

export const AuthNavbar = () => {
  return (
    <AppBar sx={{ background: "transparent" }}>
      <Toolbar>
        <AuthNavbarMobile />
        <AuthNavbarDesktop />
      </Toolbar>
    </AppBar>
  );
};
