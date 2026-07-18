import { Box } from "@mui/material";

export const metadata = {
  title: "Crear cuenta",
  description: "Crear cuenta",
  icons: {
    icon: "/iso_toluca.svg",
  },
};

const Layout = ({ children }) => {
  return (
    <main>
      <Box display="flex" justifyContent="center" alignItems="center">
        {children}
      </Box>
    </main>
  );
};

export default Layout;
