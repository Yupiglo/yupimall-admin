import type { Metadata } from "next";
import ThemeRegistry from "@/components/ThemeRegistry/ThemeRegistry";
import "./globals.css";
import Favicon from "@/assets/Logo/favicon.ico";
import { PublicEnvScript } from "next-runtime-env";
import cover from "@/assets/AuthImageCover.svg";
import NextAuthProvider from "@/components/NextAuthProvider";

export const metadata: Metadata = {
  title: "YupiFlow Dashboard",
  description: "YupiFlow Dashboard Application",
  icons: [{ rel: "icon", url: Favicon.src }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <PublicEnvScript />
      </head>
      <body>
        <NextAuthProvider>
          <ThemeRegistry>{children}</ThemeRegistry>
        </NextAuthProvider>
      </body>
    </html>
  );
}
