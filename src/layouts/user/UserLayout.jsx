import { Box } from "@mui/material";
import { UserNavbar } from "../../navbars/user/UserNavbar";

const UserLayout = ({ children }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <Box component="nav">
        <UserNavbar />
      </Box>
      <Box
        component="section"
        sx={{
          maxWidth: "1440px",
          margin: "0 auto",
          width: "100%",
          flexGrow: 1,
        }}
      >
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            width: "100%",
            maxWidth: "100%",
          }}
          className="user-layout"
        >
          {children}
        </Box>
      </Box>

      <Box component="footer">{/* <Footer /> */}</Box>
    </Box>
  );
};

export default UserLayout;
