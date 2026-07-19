import { Box } from "@mui/material";
import { Footer } from "../../components/Footer";
import NavigationMenu from "../../components/NavigationMenu/NavigationMenu";
import { MainNavbar } from "../../navbars/main/MainNavbar";
import { CONTENT_MAX_WIDTH, CONTENT_GUTTER } from "../../constants/layout";

export const MainLayout = ({ children, categories, AppBarProps, ToolbarProps }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <Box component="nav">
        <MainNavbar AppBarProps={AppBarProps} ToolbarProps={ToolbarProps} categories={categories} />
      </Box>
      <Box
        component="section"
        sx={{
          maxWidth: `${CONTENT_MAX_WIDTH}px`,
          mx: "auto",
          width: "100%",
          flexGrow: 1,
          px: CONTENT_GUTTER,
        }}
      >
        <NavigationMenu categories={categories} />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            width: "100%",
            maxWidth: "100%",
            overflowX: "hidden",
            my: 2,
          }}
        >
          {children}
        </Box>
      </Box>

      <Box component="footer">
        <Footer />
      </Box>
    </Box>
  );
};
