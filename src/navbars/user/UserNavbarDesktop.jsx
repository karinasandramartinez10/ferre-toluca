import { Box, Button, IconButton, Popover, Tooltip } from "@mui/material";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Favorite, Person, ReceiptLong } from "@mui/icons-material";
import { logout } from "../../actions/logout";
import Cart from "../../components/Cart";
import NotificationsBell from "../../components/NotificationsBell";

export const UserNavbarDesktop = () => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <Box
      justifyContent="space-between"
      width="100%"
      alignItems="center"
      sx={{ display: { xs: "none", md: "flex" } }}
    >
      <Box sx={{ display: { xs: "none", md: "block" } }}>
        <Link href="/">
          <Image
            src={"/images/texcoco_logo2.svg"}
            alt="ferreteria texcoco"
            width="120"
            height="90"
          />
        </Link>
      </Box>
      <Box sx={{ display: { xs: "none", md: "block" } }}></Box>
      <Box display="flex" alignItems="center" gap={1}>
        <Tooltip title="Mis favoritos" arrow>
          <IconButton color="grey.main" href="/favorites">
            <Favorite />
          </IconButton>
        </Tooltip>
        <Tooltip title="Historial de órdenes" arrow>
          <IconButton color="grey.main" href="/history">
            <ReceiptLong />
          </IconButton>
        </Tooltip>
        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={handlePopoverClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
        >
          <Box sx={{ p: 2 }}>
            <>
              <Button
                onClick={logout}
                color="error"
                fullWidth
                variant="outlined"
              >
                Cerrar sesión
              </Button>
            </>
          </Box>
        </Popover>
        <Cart />
        <NotificationsBell />
        <Tooltip title="Mi cuenta" arrow>
          <IconButton color="grey.main" onClick={handlePopoverOpen}>
            <Person />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
};
