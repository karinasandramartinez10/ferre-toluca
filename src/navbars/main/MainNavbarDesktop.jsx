import { AdminPanelSettings, Person } from "@mui/icons-material";
import { Box, Button, IconButton, Popover, Stack, Tooltip, Typography } from "@mui/material";
import Link from "next/link";
import Image from "next/image";
import Cart from "../../components/Cart";
import { logout } from "../../lib/logout";
import { useState } from "react";
import SearchComponent from "../../components/Search";
import NotificationsBell from "../../components/NotificationsBell";
import PricesLegendChip from "../../components/PricesLegendChip";
import useResponsive from "../../hooks/use-responsive";

export const MainNavbarDesktop = ({ session }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const isMobile = useResponsive("down", "sm");

  const isAuthenticated = !!session?.user;
  const isAdmin = session?.user?.role === "admin" || session?.user?.role === "superadmin";

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const Logout = () => {
    logout({ callbackUrl: "/" });
  };

  const open = Boolean(anchorEl);

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
              src={"/images/tolucawhite.svg"}
              alt="Ferretera Toluca"
              fill
              sizes="120px"
              priority
              style={{ objectFit: "contain" }}
            />
          </Box>
        </Link>
      )}
      <Box sx={{ display: { xs: "none", md: "block" } }}>
        <SearchComponent />
      </Box>
      <Box display="flex" alignItems="center" gap={1}>
        {isAuthenticated && !isAdmin && <PricesLegendChip />}
        {isAdmin && (
          <Tooltip title="Panel de administador" arrow>
            <IconButton
              sx={(theme) => ({
                color: theme.palette.grey.light,
              })}
              component={Link}
              href="/admin/quotes"
            >
              <AdminPanelSettings />
            </IconButton>
          </Tooltip>
        )}
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
          <Stack sx={{ p: 2, gap: 1 }}>
            {isAuthenticated && !isAdmin && (
              <Button variant="contained" component={Link} href="/user/profile/fiscal" fullWidth>
                Mi Cuenta
              </Button>
            )}
            {isAuthenticated ? (
              <Button onClick={Logout} color="error" fullWidth variant="outlined">
                Cerrar sesión
              </Button>
            ) : (
              <>
                <Typography fontWeight={700} variant="body1" sx={{ mb: 1 }}>
                  Accede a tu cuenta
                </Typography>
                <Button variant="contained" component={Link} href="/auth/login" fullWidth>
                  Iniciar sesión
                </Button>
                <Button
                  variant="outlined"
                  component={Link}
                  href="/contact"
                  fullWidth
                  sx={{ mt: 1 }}
                >
                  Contáctanos
                </Button>
              </>
            )}
          </Stack>
        </Popover>
        {!isAdmin && <Cart />}
        {isAuthenticated && <NotificationsBell />}
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

export default MainNavbarDesktop;
