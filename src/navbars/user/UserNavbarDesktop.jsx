import { Box, Button, IconButton, Popover, Tooltip } from "@mui/material";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Favorite, Person, ReceiptLong } from "@mui/icons-material";
import { logout } from "../../actions/logout";
import Cart from "../../components/Cart";
import NotificationsBell from "../../components/NotificationsBell";
import useResponsive from "../../hooks/use-responsive";

export const UserNavbarDesktop = () => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const isMobile = useResponsive("down", "sm");

  return (
    <Box
      justifyContent="space-between"
      width="100%"
      alignItems="center"
      sx={{ display: { xs: "none", md: "flex" } }}
    >
      {!isMobile && (
        <Link href="/" style={{ display: "inline-block", lineHeight: 0 }}>
          <Box sx={{ position: "relative", width: 120, height: 60 }}>
            <Image
              src={"/images/texcocowhite.svg"}
              alt="ferreteria texcoco"
              fill
              sizes="120px"
              style={{ objectFit: "contain" }}
            />
          </Box>
        </Link>
      )}
      <Box sx={{ display: { xs: "none", md: "block" } }}></Box>
      <Box display="flex" alignItems="center" gap={1}>
        <Tooltip title="Mis favoritos" arrow>
          <IconButton
            sx={(theme) => ({
              color: theme.palette.grey.light,
            })}
            component={Link}
            href="/favorites"
          >
            <Favorite />
          </IconButton>
        </Tooltip>
        <Tooltip title="Historial de órdenes" arrow>
          <IconButton
            sx={(theme) => ({
              color: theme.palette.grey.light,
            })}
            component={Link}
            href="/history"
          >
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
          <IconButton
            sx={(theme) => ({
              color: theme.palette.grey.light,
            })}
            onClick={handlePopoverOpen}
          >
            <Person />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default UserNavbarDesktop;
