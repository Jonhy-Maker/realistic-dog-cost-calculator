import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import { Navbar, Footer } from "@/components/SiteChrome";
import GoogleAnalytics from "./GoogleAnalytics";


const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://realistic-dog-cost-calculator-seven.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: "Realistic Dog Cost Calculator | What Will Your Dog Really Cost?",
    template: "%s | Realistic Dog Cost Calculator",
  },

  description:
    "Estimate your dog's monthly, yearly, first-year and lifetime ownership costs with a realistic, adjustable dog cost calculator.",

  applicationName: "Realistic Dog Cost Calculator",

  alternates: {
    canonical: "/",
  },

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    title: "Realistic Dog Cost Calculator",
    description: "See what your dog could really cost over a lifetime.",
    type: "website",
    url: siteUrl,
    siteName: "Realistic Dog Cost Calculator",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Realistic Dog Cost Calculator",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Realistic Dog Cost Calculator",
    description:
      "Estimate monthly, yearly, first-year and lifetime dog ownership costs.",
    images: ["/og-image.png"],
  },

  icons: {
    icon: "/icon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#1f7a58",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7925832816251718"
          crossOrigin="anonymous"
          strategy="beforeInteractive"
        />
      </head>

      <body>
        <GoogleAnalytics />
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}