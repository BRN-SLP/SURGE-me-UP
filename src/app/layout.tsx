import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import ContextProvider from "@/context";
import { headers } from "next/headers";
import { cn } from "@/lib/utils";

// Reown AppKit styles are imported automatically

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "SURGE me UP",
  description: "Amplify your achievements with SURGE - the Superchain recognition engine",
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { WalletStatus } from "@/components/ui/WalletStatus";
import { LiquidGradient } from "@/components/ui/LiquidGradient";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const cookies = headersList.get('cookie');

  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-black font-sans antialiased flex flex-col relative overflow-x-hidden",
          inter.variable,
          outfit.variable
        )}
      >
        <LiquidGradient />
        <ContextProvider cookies={cookies}>
          <div className="relative z-10">
            <Navbar />
            <WalletStatus />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ContextProvider>
      </body>
    </html>
  );
}


