import type { Metadata } from "next";
import { Inter, Outfit, Space_Grotesk, Noto_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import ContextProvider from "@/context";
import { headers } from "next/headers";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { WalletStatus } from "@/components/ui/WalletStatus";
import { LenisProvider } from "@/components/providers/LenisProvider";
import ClientNetworkBackground from "@/components/ui/ClientNetworkBackground";
import { HydrationSuppressor } from "@/components/dev/HydrationSuppressor";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk" });
const notoSans = Noto_Sans({ subsets: ["latin"], variable: "--font-noto-sans", weight: ["400", "700"] });

export const metadata: Metadata = {
  title: "SURGE me UP",
  description: "Mint your on-chain identity",
  icons: {
    icon: [
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico" },
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const cookies = headersList.get('cookie');

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block" />
      </head>
      <body
        suppressHydrationWarning
        className={cn(
          "min-h-screen bg-background font-sans antialiased flex flex-col relative overflow-x-hidden",
          inter.variable,
          outfit.variable,
          spaceGrotesk.variable,
          notoSans.variable
        )}
      >
        <ContextProvider cookies={cookies}>
          <LenisProvider>
            <ClientNetworkBackground />
            <HydrationSuppressor />
            <div className="relative z-10">
              <Navbar />
              <WalletStatus />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </LenisProvider>
        </ContextProvider>
      </body>
    </html>
  );
}
