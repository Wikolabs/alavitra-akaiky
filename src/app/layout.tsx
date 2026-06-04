import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
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
  openGraph: {
    title: "inme.one — Conseiller biblique IA + Église en ligne",
    description:
      "Trouvez la Paix. Recevez la Lumière. Un compagnon spirituel formé sur les Écritures, disponible 24h/24.",
    type: "website",
    locale: "fr_FR",
    siteName: "inme.one",
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
