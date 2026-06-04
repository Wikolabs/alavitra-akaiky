import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://inme.one"),
  title: "inme.one — Conseiller biblique IA + Église en ligne, 24h/24",
  description:
    "Un compagnon spirituel disponible jour et nuit. Dialoguez avec un conseiller IA formé sur les Écritures, écoutez des messages de la communauté, recevez la Lumière. inme — In Me, In You.",
  keywords: [
    "conseiller biblique",
    "chatbot spirituel",
    "église en ligne",
    "théologie chrétienne",
    "verset biblique",
    "prière",
    "Réveil",
    "Révélation",
    "Foi",
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
    title: "inme.one — Conseiller biblique IA + Église en ligne",
    description:
      "Trouvez la Paix. Recevez la Lumière. Un compagnon spirituel formé sur les Écritures, disponible 24h/24.",
    type: "website",
    locale: "fr_FR",
    siteName: "inme.one",
    url: "https://inme.one",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "inme.one — Trouvez la Paix. Recevez la Lumière.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "inme.one — Conseiller biblique IA + Église en ligne",
    description: "Trouvez la Paix. Recevez la Lumière. Disponible 24h/24.",
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
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        style={{
          margin: 0,
          fontFamily: "var(--font-body), Inter, -apple-system, BlinkMacSystemFont, sans-serif",
          background: "#FFFFFF",
          color: "#0F172A",
          WebkitFontSmoothing: "antialiased",
        }}
      >
        {children}
      </body>
    </html>
  );
}
