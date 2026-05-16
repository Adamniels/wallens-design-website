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
    default: "Wallens Design — Fine Jewellery",
    template: "%s | Wallens Design",
  },
  description:
    "Handgjorda smycken och skräddarsydda beställningar. Varje piece skapad med omsorg och avsikt, designad att bäras livet ut.",
  openGraph: {
    title: "Wallens Design — Fine Jewellery",
    description:
      "Handcrafted jewellery and bespoke commissions. Each piece made with intention, designed to last a lifetime.",
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
