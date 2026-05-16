import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { client } from "@/sanity/client";
import {
  pieceBySlugQuery,
  allPieceSlugsQuery,
  PieceDetail,
} from "@/sanity/queries";
import { urlFor } from "@/sanity/image";
import StatusBadge from "@/components/StatusBadge";
import PortableTextRenderer from "@/components/PortableTextRenderer";
import PieceGallery from "@/components/PieceGallery";
import type { Locale } from "@/lib/i18n";
import { getT, localePath, locales } from "@/lib/i18n";

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await client.fetch<{ slug: string }[]>(allPieceSlugsQuery);
  return locales.flatMap((locale) =>
    slugs.map(({ slug }) => ({ locale, slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const piece = await client.fetch<PieceDetail | null>(pieceBySlugQuery, {
    slug,
  });
  if (!piece) return { title: "Piece not found" };

  const title =
    locale === "en" && piece.title_en ? piece.title_en : piece.title;

  return {
    title,
    description: `${title} — handcrafted ${piece.category} by Wallens Design.`,
    openGraph: {
      images: [
        urlFor(piece.heroImage).width(1200).height(630).fit("crop").url(),
      ],
    },
  };
}

export default async function PieceDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const piece = await client.fetch<PieceDetail | null>(pieceBySlugQuery, {
    slug,
  });

  if (!piece) notFound();

  const tr = getT(locale as Locale);
  const lp = (path: string) => localePath(locale as Locale, path);

  // Use locale-specific content with Swedish fallback
  const title =
    locale === "en" && piece.title_en ? piece.title_en : piece.title;
  const description =
    locale === "en" && piece.description_en?.length
      ? piece.description_en
      : piece.description;

  const heroUrl = urlFor(piece.heroImage)
    .width(1600)
    .height(1000)
    .fit("crop")
    .auto("format")
    .url();

  const heroBlurhash = urlFor(piece.heroImage)
    .width(20)
    .height(13)
    .fit("crop")
    .blur(50)
    .url();

  const hasGallery = piece.images && piece.images.length > 0;
  const hasDimensions =
    piece.dimensions &&
    (piece.dimensions.height ||
      piece.dimensions.width ||
      piece.dimensions.depth);

  return (
    <>
      {/* Hero image — full bleed */}
      <section className="relative w-full pt-16 md:pt-20 bg-cream-dark">
        <div className="relative w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden">
          <Image
            src={heroUrl}
            alt={piece.heroImage.alt ?? title}
            fill
            className="object-cover"
            placeholder="blur"
            blurDataURL={heroBlurhash}
            priority
            sizes="100vw"
          />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-cream-dark to-transparent" />
        </div>
      </section>

      {/* Piece content */}
      <section className="bg-cream-dark pb-24">
        <div className="page-container">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 lg:gap-20 pt-12">

            {/* Left: gallery + description */}
            <div>
              {hasGallery && (
                <PieceGallery images={piece.images!} pieceTitle={title} />
              )}

              {description && description.length > 0 && (
                <div>
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-8 h-px bg-gold" />
                    <p className="font-sans text-xs tracking-[0.25em] uppercase text-gold">
                      {tr.piece.aboutPiece}
                    </p>
                  </div>
                  <PortableTextRenderer value={description} />
                </div>
              )}
            </div>

            {/* Right: sticky details panel */}
            <div className="lg:sticky lg:top-28 self-start space-y-8">

              <div className="flex items-center gap-2 text-xs font-sans text-charcoal/40">
                <Link href={lp("/portfolio")} className="hover:text-forest transition-colors">
                  {tr.piece.breadcrumbWork}
                </Link>
                <span>/</span>
                <span className="text-charcoal/60">
                  {tr.categories[piece.category as keyof typeof tr.categories] ?? piece.category}
                </span>
              </div>

              <div>
                <h1
                  className="font-serif text-display-md text-forest mb-4 leading-tight"
                  style={{ fontWeight: 300 }}
                >
                  {title}
                </h1>
                <StatusBadge status={piece.status} />
              </div>

              {piece.price && piece.status === "available" && (
                <div>
                  <p className="font-sans text-xs tracking-widest uppercase text-charcoal/40 mb-1">
                    {tr.piece.price}
                  </p>
                  <p className="font-serif text-3xl text-forest">
                    {piece.price.toLocaleString("sv-SE")}{" "}
                    <span className="text-lg text-charcoal/40">kr</span>
                  </p>
                </div>
              )}

              {piece.materials && piece.materials.length > 0 && (
                <div>
                  <p className="font-sans text-xs tracking-widest uppercase text-charcoal/40 mb-3">
                    {tr.piece.materials}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {piece.materials.map((m) => (
                      <span
                        key={m}
                        className="font-sans text-xs px-3 py-1.5 bg-sand border border-sand-dark text-charcoal/70"
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {piece.gemstones && piece.gemstones.length > 0 && (
                <div>
                  <p className="font-sans text-xs tracking-widest uppercase text-charcoal/40 mb-3">
                    {tr.piece.gemstones}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {piece.gemstones.map((g) => (
                      <span
                        key={g}
                        className="font-sans text-xs px-3 py-1.5 bg-cream border border-sand text-charcoal/70"
                      >
                        {g}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {hasDimensions && (
                <div>
                  <p className="font-sans text-xs tracking-widest uppercase text-charcoal/40 mb-3">
                    {tr.piece.dimensions}
                  </p>
                  <table className="font-sans text-sm text-charcoal/70 w-full">
                    <tbody>
                      {piece.dimensions!.height && (
                        <tr className="border-b border-sand">
                          <td className="py-2 text-charcoal/40">{tr.piece.height}</td>
                          <td className="py-2 text-right">{piece.dimensions!.height} mm</td>
                        </tr>
                      )}
                      {piece.dimensions!.width && (
                        <tr className="border-b border-sand">
                          <td className="py-2 text-charcoal/40">{tr.piece.width}</td>
                          <td className="py-2 text-right">{piece.dimensions!.width} mm</td>
                        </tr>
                      )}
                      {piece.dimensions!.depth && (
                        <tr className="border-b border-sand">
                          <td className="py-2 text-charcoal/40">{tr.piece.depth}</td>
                          <td className="py-2 text-right">{piece.dimensions!.depth} mm</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                  {piece.dimensions!.note && (
                    <p className="font-sans text-xs text-charcoal/40 mt-2 italic">
                      {piece.dimensions!.note}
                    </p>
                  )}
                </div>
              )}

              {piece.weightGrams && (
                <div>
                  <p className="font-sans text-xs tracking-widest uppercase text-charcoal/40 mb-1">
                    {tr.piece.weight}
                  </p>
                  <p className="font-sans text-sm text-charcoal/70">{piece.weightGrams} g</p>
                </div>
              )}

              {piece.year && (
                <div>
                  <p className="font-sans text-xs tracking-widest uppercase text-charcoal/40 mb-1">
                    {tr.piece.year}
                  </p>
                  <p className="font-sans text-sm text-charcoal/70">{piece.year}</p>
                </div>
              )}

              <div className="w-full h-px bg-gold/30" />

              {piece.status !== "sold" && (
                <Link
                  href={`${lp("/contact")}?piece=${encodeURIComponent(title)}`}
                  className="block w-full text-center bg-forest text-cream font-sans text-sm tracking-widest uppercase px-6 py-4 hover:bg-forest-dark transition-colors duration-300"
                >
                  {piece.status === "commission"
                    ? tr.piece.inquireCommission
                    : tr.piece.inquirePiece}
                </Link>
              )}

              <Link
                href={lp("/portfolio")}
                className="block w-full text-center border border-forest/30 text-forest/60 font-sans text-xs tracking-widest uppercase px-6 py-3 hover:border-forest hover:text-forest transition-all duration-300"
              >
                {tr.piece.backToAll}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
