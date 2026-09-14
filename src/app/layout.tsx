import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap", weight: ["400", "500", "600"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://inme.one"),
  title: "inme.one, un compagnon qui écoute, une Écriture qui répond",
  description:
    "Dites ce que vous portez. inme.one répond avec un passage exact des Écritures, en français ou en malgache, puis vous propose un toriteny à écouter sur le même sujet. Gratuit, anonyme, jour et nuit.",
  keywords: [
    "conseiller biblique",
    "toriteny malagasy",
    "verset du jour",
    "Baiboly malagasy",
    "Louis Segond",
    "prière",
    "accompagnement spirituel",
    "inme.one",
  ].join(", "),
  icons: {
    icon: [
      { url: "/logo.svg", type: "image/svg+xml" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
    shortcut: "/favicon-32.png",
  },
  openGraph: {
    title: "inme.one, un compagnon qui écoute, une Écriture qui répond",
    description:
      "Un passage exact des Écritures pour ce que vous portez, en français ou en malgache, et un toriteny à écouter sur le même sujet.",
    type: "website",
    locale: "fr_FR",
    siteName: "inme.one",
    url: "https://inme.one",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "inme.one" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "inme.one, un compagnon qui écoute, une Écriture qui répond",
    description: "Un passage exact pour ce que vous portez, et un message à écouter.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
