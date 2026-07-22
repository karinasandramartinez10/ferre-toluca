import { Inter, Montserrat } from "next/font/google";
import "./globals.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import Providers from "../providers/providers";
import { SessionProvider } from "next-auth/react";
import GlobalAuthWatcher from "../components/GlobalAuthWatcher";
import AuthTokenSync from "../components/AuthTokenSync";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({ subsets: ["latin"] });
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["800"],
  variable: "--font-montserrat",
});

export const metadata = {
  title: "Ferretera Toluca",
  description: "Ferretera Toluca",
  icons: {
    icon: "/iso_toluca.svg",
  },
};

// Sin `auth()` aquí: leería cookies y volvería dinámico todo el árbol, rompiendo
// la generación on-demand de las rutas estáticas (/product/[id] con ids nuevos).
// SessionProvider resuelve la sesión en cliente; el middleware sigue protegiendo rutas.
export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={`${inter.className} ${montserrat.variable}`}>
        <AppRouterCacheProvider>
          <SessionProvider refetchOnWindowFocus={false} refetchInterval={0}>
            <Providers>
              <GlobalAuthWatcher />
              <AuthTokenSync />
              {children}
              <Analytics debug={false} />
              <SpeedInsights debug={false} />
            </Providers>
          </SessionProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
