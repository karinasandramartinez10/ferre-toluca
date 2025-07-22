import {
  AdminPanelSettings,
  Favorite,
  Person,
  ReceiptLong,
} from "@mui/icons-material";
import {
  Box,
  Button,
  IconButton,
  Popover,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import Link from "next/link";
import Image from "next/image";
import Cart from "../../components/Cart";
import { logout } from "../../actions/logout";
import { useState } from "react";
import SearchComponent from "../../components/Search";
import NotificationsBell from "../../components/NotificationsBell";

export const MainNavbarDesktop = ({ session }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const isAuthenticated = !!session?.user;
  const isAdmin =
    session?.user?.role === "admin" || session?.user?.role === "superadmin";

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const Logout = () => {
    logout()
  }

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
      <Box sx={{ display: { xs: "none", md: "block" } }}>
        <SearchComponent />
      </Box>
      <Box display="flex" alignItems="center" gap={1}>
        {isAuthenticated && !isAdmin && (
          <>
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
          </>
        )}
        {isAdmin && (
          <Tooltip title="Panel de administador" arrow>
            <IconButton color="grey.main" href="/admin/quotes">
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
          <Stack sx={{ p: 2 }}>
            {isAuthenticated ? (
              <Button
                onClick={Logout}
                color="error"
                fullWidth
                variant="outlined"
              >
                Cerrar sesión
              </Button>
            ) : (
              <>
                <Typography fontWeight={700} variant="body1" sx={{ mb: 1 }}>
                  Accede o crea una cuenta
                </Typography>
                <Button variant="contained" href="/auth/login" fullWidth>
                  Iniciar sesión
                </Button>
                <Button
                  variant="outlined"
                  href="/auth/signup"
                  fullWidth
                  sx={{ mt: 1 }}
                >
                  Crear una cuenta
                </Button>
              </>
            )}
          </Stack>
        </Popover>
        {!isAdmin && <Cart />}
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
