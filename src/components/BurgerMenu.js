import React from "react";
import {
  Box,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Divider,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Image from "next/image";
import NextLink from "next/link";
import { logout } from "../actions/logout";

const BurgerMenuItem = ({ icon, text, href, onClose }) => {
  return (
    <NextLink href={href} passHref legacyBehavior>
      <ListItem onClick={onClose(false)}>
        <Link
          color="primary.light"
          sx={{
            display: "flex",
            alignItems: "center",
            fontWeight: 600,
            textDecoration: "none",
            "&:hover": {
              cursor: "pointer",
            },
          }}
        >
          <ListItemIcon
            sx={(theme) => ({
              minWidth: "32px",
              color: theme.palette.primary.main,
            })}
          >
            {icon}
          </ListItemIcon>
          <ListItemText primary={text} />
        </Link>
      </ListItem>
    </NextLink>
  );
};

const BurgerMenuSection = ({ title, items, onClose }) => {
  return (
    <List sx={{}}>
      <ListItemText
        sx={{
          paddingLeft: 2,
        }}
        primary={title ? title : null}
        primaryTypographyProps={{
          color: "primary.main",
          fontWeight: "medium",
          variant: "body3",
        }}
      />
      {items.map((option, index) => (
        <BurgerMenuItem key={index} {...option} onClose={onClose} />
      ))}
    </List>
  );
};

export const BurgerMenu = ({ toggleDrawer, sections, showLogout, src }) => {
  const logoutButton = <Button onClick={() => logout()}>Cerrar sesión</Button>;

  return (
    <Box sx={{ p: 2, height: 1 }}>
      <Box display="flex" flexDirection="column" gap={1}>
        <Box display="flex" justifyContent="space-between" height="48px">
          <NextLink href="/" passHref legacyBehavior>
            <Link display="flex" alignItems="center">
              <Image src={src} alt="logo" width="80" height="45" />
            </Link>
          </NextLink>
          <IconButton
            size="large"
            edge="start"
            aria-label="menu"
            onClick={toggleDrawer(false)}
            color="primary"
            // sx={{ color: "#FFF"}}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider />
        {sections.map((section, index) => (
          <React.Fragment key={index}>
            {index > 0 && <Divider />}
            <BurgerMenuSection {...section} onClose={toggleDrawer} />
          </React.Fragment>
        ))}
        {showLogout ? logoutButton : undefined}
      </Box>
    </Box>
  );
};
