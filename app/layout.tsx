import type { Metadata, Viewport } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";
import Header from "../src/components/Header";
import Footer from "../src/components/Footer";
import { ToastProvider } from "../src/components/Toast";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://robcodes.net";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#1a1a2e",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/",
  },
  other: {
    "google-adsense-account": "ca-pub-8322508130871793",
  },
  title: {
    default: "RoBcodes | Free Roblox Game Codes & Rewards 2026",
    template: "%s | RoBcodes",
  },
  description: "Find active, daily-tested Roblox game promo codes for Blox Fruits, Blade Ball, King Legacy, Anime Defenders, and 100+ top Roblox games. One-tap copy codes!",
  keywords: ["roblox codes", "blox fruits codes 2026", "blade ball codes", "king legacy codes", "anime defenders codes", "roblox redeem codes"],
  authors: [{ name: "Aero Team" }],
  creator: "Aero Team",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "RoBcodes",
    title: "RoBcodes | Free Roblox Game Codes & Rewards 2026",
    description: "Daily-verified Roblox game codes with 1-tap instant copy.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "RoBcodes Roblox Game Redeem Codes",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "RoBcodes | Free Roblox Game Codes & Rewards 2026",
    description: "Daily-verified Roblox game codes with 1-tap instant copy.",
    images: ["https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&auto=format&fit=crop&q=80"],
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${outfit.variable} ${inter.variable}`}>
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8322508130871793"
          crossOrigin="anonymous"
        />
      </head>
      <body>
          <ToastProvider>
            <Header />
            {children}
            <Footer />
          </ToastProvider>
      </body>
    </html>
  );
}
