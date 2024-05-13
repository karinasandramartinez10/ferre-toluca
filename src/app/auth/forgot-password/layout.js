import { Box } from "@mui/material";

export const metadata = {
  title: "Olvidé contraseña",
  description: "Reset",
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
