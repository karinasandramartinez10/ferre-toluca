import { Box } from "@mui/material";

export const metadata = {
  title: "Iniciar sesión",
  description: "Iniciar sesión",
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
