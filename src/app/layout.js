import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnnouncementBar from "@/components/AnnouncementBar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL("https://example.com"),

  title: {
    default: "Online Store",
    template: "%s | Online Store",
  },

  description: "A reusable online store built with Next.js.",

  keywords: ["online store", "ecommerce", "shop", "products"],

  authors: [
    {
      name: "Store Name",
      url: "https://example.com",
    },
  ],

  creator: "Store Name",
  publisher: "Store Name",

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    title: "Online Store",
    description: "A reusable online store built with Next.js.",
    url: "https://example.com",
    siteName: "Online Store",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Online Store",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Online Store",
    description: "A reusable online store built with Next.js.",
    images: ["/images/og-image.jpg"],
  },

  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AnnouncementBar />
        <Header />

        {children}

        <Footer />
      </body>
    </html>
  );
}
