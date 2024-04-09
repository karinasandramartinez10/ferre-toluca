import { Box } from "@mui/material";
import { AuthNavbar } from "../../../navbars/auth/AuthNavbar";

export const metadata = {
  title: "SignUp",
  description: "SignUp",
};

const Layout = ({ children }) => {
  return (
    <>
      <nav>
         {/* <AuthNavbar />  */}
      </nav>
      <main>
        <Box display="flex" justifyContent="center" alignItems="center">
          {children}
        </Box>
      </main>
    </>
  );
};

export default Layout;
