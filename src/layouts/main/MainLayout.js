import { Box } from "@mui/material";
import { Footer } from "../../components/Footer";
import NavigationMenu from "../../components/NavigationMenu/NavigationMenu";
import { MainNavbar } from "../../navbars/main/MainNavbar";

export const MainLayout = ({
  children,
  categories,
  AppBarProps,
  ToolbarProps,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <Box component="nav">
        <MainNavbar
          AppBarProps={AppBarProps}
          ToolbarProps={ToolbarProps}
          categories={categories}
        />
      </Box>
      <Box component="section">
        <NavigationMenu categories={categories} />
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: "100%",
          maxWidth: "100%",
        }}
        className="main-layout"
      >
        {children}
      </Box>
      <Box component="footer">
        <Footer />
      </Box>
    </Box>
  );
};
