import { Box } from "@mui/material";
import { AuthNavbar } from "../../../navbars/auth/AuthNavbar";

export const metadata = {
  title: "Crear cuenta",
  description: "Crear cuenta",
  icons: {
    icon: "/iso_texcoco.svg",
  },
};

const Layout = ({ children }) => {
  return (
    <>
      <nav>{/* <AuthNavbar />  */}</nav>
      <main>
        <Box display="flex" justifyContent="center" alignItems="center">
          {children}
        </Box>
      </main>
    </>
  );
};

export default Layout;
