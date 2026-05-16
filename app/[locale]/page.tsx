import Link from "next/link";
import { client } from "@/sanity/client";
import type { PieceCard as PieceCardData } from "@/sanity/queries";
import { featuredPiecesQuery, recentPiecesQuery } from "@/sanity/queries";
import PieceCard from "@/components/PieceCard";
import type { Locale } from "@/lib/i18n";
import { getT, localePath } from "@/lib/i18n";

export const revalidate = 60;

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const tr = getT(locale as Locale);

  let pieces = await client.fetch<PieceCardData[]>(featuredPiecesQuery);
  if (pieces.length === 0) {
    pieces = await client.fetch<PieceCardData[]>(recentPiecesQuery);
  }

  const lp = (path: string) => localePath(locale as Locale, path);

  return (
    <>
      {/* Hero */}
      <section
        data-animate="hero"
        className="relative min-h-screen flex items-center bg-cream pt-20"
      >
        <div className="page-container">
          <div data-animate="hero-content" className="max-w-3xl">
            <p
              data-animate="hero-item"
              className="font-sans text-xs tracking-[0.25em] uppercase text-gold mb-8"
            >
              {tr.home.eyebrow}
            </p>
            <h1
              data-animate="hero-item"
              className="font-serif text-display-xl text-forest mb-8 leading-tight"
              style={{ fontWeight: 300 }}
            >
              {tr.home.headline1}
              <br />
              <em>{tr.home.headline2}</em>
            </h1>
            <p
              data-animate="hero-item"
              className="font-sans text-base md:text-lg text-charcoal/70 mb-12 max-w-lg leading-relaxed"
            >
              {tr.home.body}
            </p>
            <div data-animate="hero-item" className="flex flex-wrap gap-4">
              <Link
                href={lp("/portfolio")}
                className="inline-flex items-center gap-3 bg-forest text-cream font-sans text-sm tracking-widest uppercase px-8 py-4 hover:bg-forest-dark transition-colors duration-300"
              >
                {tr.home.ctaWork}
              </Link>
              <Link
                href={lp("/commissions")}
                className="inline-flex items-center gap-3 border border-forest text-forest font-sans text-sm tracking-widest uppercase px-8 py-4 hover:bg-forest hover:text-cream transition-all duration-300"
              >
                {tr.home.ctaCommission}
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative gold vertical lines */}
        <div
          data-animate="hero-lines"
          className="absolute right-8 md:right-16 top-1/2 -translate-y-1/2 hidden md:flex flex-col items-center gap-4"
        >
          <div className="w-px h-24 bg-gold/40" />
          <p
            className="font-sans text-xs tracking-[0.2em] uppercase text-gold/60"
            style={{ writingMode: "vertical-rl" }}
          >
            {tr.home.scrollHint}
          </p>
          <div className="w-px h-24 bg-gold/40" />
        </div>
      </section>

      {/* Featured pieces */}
      {pieces.length > 0 && (
        <section className="bg-cream-dark py-24">
          <div className="page-container">
            <div className="flex items-end justify-between mb-12">
              <div>
                <p
                  data-animate="fade-up"
                  className="font-sans text-xs tracking-[0.25em] uppercase text-gold mb-3"
                >
                  {tr.home.selectedWork}
                </p>
                <h2
                  data-animate="fade-up"
                  className="font-serif text-display-md text-forest"
                  style={{ fontWeight: 300 }}
                >
                  {tr.home.recentPieces}
                </h2>
              </div>
              <Link
                href={lp("/portfolio")}
                className="hidden md:inline-flex font-sans text-xs tracking-widest uppercase text-forest/60 hover:text-gold transition-colors duration-300 pb-1 border-b border-forest/20 hover:border-gold"
              >
                {tr.home.viewAll}
              </Link>
            </div>

            <div
              data-animate="cascade"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {pieces.map((piece, i) => (
                <PieceCard
                  key={piece._id}
                  piece={piece}
                  priority={i === 0}
                  locale={locale as Locale}
                />
              ))}
            </div>

            <div className="mt-10 md:hidden text-center">
              <Link
                href={lp("/portfolio")}
                className="font-sans text-xs tracking-widest uppercase text-forest/60 hover:text-gold transition-colors duration-300 pb-1 border-b border-forest/20 hover:border-gold"
              >
                {tr.home.viewAll}
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Commission invite block */}
      <section className="bg-forest py-24 md:py-32">
        <div className="page-container text-center">
          <p
            data-animate="fade-up"
            className="font-sans text-xs tracking-[0.25em] uppercase text-gold mb-6"
          >
            {tr.home.bespoke}
          </p>
          <h2
            data-animate="fade-up"
            className="font-serif text-display-lg text-cream mb-6 max-w-2xl mx-auto"
            style={{ fontWeight: 300 }}
          >
            {tr.home.bespokeHeadline}
          </h2>
          <p
            data-animate="fade-up"
            className="font-sans text-base text-cream/60 mb-12 max-w-xl mx-auto leading-relaxed"
          >
            {tr.home.bespokeBody}
          </p>
          <div data-animate="fade-up">
            <Link
              href={lp("/commissions")}
              className="inline-flex items-center gap-3 border border-gold text-gold font-sans text-sm tracking-widest uppercase px-8 py-4 hover:bg-gold hover:text-forest transition-all duration-300"
            >
              {tr.home.ctaBespoke}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
