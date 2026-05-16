import type { Metadata } from "next";
import Link from "next/link";
import { client } from "@/sanity/client";
import { allPiecesQuery, PieceCard } from "@/sanity/queries";
import PortfolioGrid from "@/components/PortfolioGrid";
import type { Locale } from "@/lib/i18n";
import { getT } from "@/lib/i18n";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const tr = getT(locale as Locale);
  return {
    title: tr.portfolio.eyebrow,
    description:
      locale === "sv"
        ? "En samling handgjorda möbler och skräddarsytt träarbete — varje objekt byggt med intention."
        : "A collection of handcrafted furniture and bespoke woodwork — each piece built with intention.",
  };
}

export default async function PortfolioPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const tr = getT(locale as Locale);
  const pieces = await client.fetch<PieceCard[]>(allPiecesQuery);

  return (
    <>
      {/* Page header */}
      <section className="pt-36 pb-16 bg-cream">
        <div className="page-container">
          <p className="font-sans text-xs tracking-[0.25em] uppercase text-gold mb-4">
            {tr.portfolio.eyebrow}
          </p>
          <h1
            className="font-serif text-display-lg text-forest mb-6"
            style={{ fontWeight: 300 }}
          >
            {tr.portfolio.headline}
          </h1>
          <div className="w-12 h-px bg-gold" />
        </div>
      </section>

      {/* Grid */}
      <section className="bg-cream pb-24">
        <div className="page-container">
          {pieces.length === 0 ? (
            <div className="py-32 text-center">
              <p className="font-serif text-2xl text-forest/40 mb-4">
                {tr.portfolio.empty}
              </p>
              <p className="font-sans text-sm text-charcoal/40">
                {locale === "sv"
                  ? "Lägg till ditt första objekt i "
                  : "Add your first piece in the "}
                <Link
                  href="/studio"
                  className="underline hover:text-forest transition-colors"
                >
                  {tr.portfolio.emptyLink}
                </Link>
                .
              </p>
            </div>
          ) : (
            <PortfolioGrid pieces={pieces} locale={locale as Locale} />
          )}
        </div>
      </section>
    </>
  );
}
