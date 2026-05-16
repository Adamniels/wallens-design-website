import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "SM Struktur — Finsnickeri",
    template: "%s | SM Struktur",
  },
  description:
    "Handgjorda möbler och skräddarsytt träarbete. Varje objekt byggt med intention — designat för att hålla livet ut.",
  openGraph: {
    title: "SM Struktur — Finsnickeri",
    description:
      "Handcrafted furniture and bespoke woodwork. Each piece built with intention.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sv" className={`${cormorant.variable} ${inter.variable}`}>
      <body className="bg-cream text-charcoal antialiased min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
