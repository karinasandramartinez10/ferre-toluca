import { Inter } from "next/font/google";
import "./globals.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import Providers from "../providers/providers";
import { SessionProvider } from "next-auth/react";
import "./globals.css";
import GlobalAuthWatcher from "../components/GlobalAuthWatcher";
import { auth } from "../auth";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Ferretería Texcoco",
  description: "Ferretería Texcoco",
  icons: {
    icon: "/iso_texcoco.svg",
  },
};

export default async function RootLayout({ children }) {
  const session = await auth();
  return (
    <html lang="es">
      <body className={inter.className}>
        <AppRouterCacheProvider>
          <SessionProvider
            session={session}
            refetchOnWindowFocus={false}
            refetchInterval={0}
          >
            <Providers>
              <GlobalAuthWatcher />
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
