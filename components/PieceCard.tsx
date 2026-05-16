import Link from "next/link";
import Image from "next/image";
import { PieceCard as PieceCardType } from "@/sanity/queries";
import { urlFor } from "@/sanity/image";
import StatusBadge from "./StatusBadge";
import type { Locale } from "@/lib/i18n";
import { getT, localePath } from "@/lib/i18n";

interface Props {
  piece: PieceCardType;
  priority?: boolean;
  locale?: Locale;
}

export default function PieceCard({ piece, priority = false, locale = "sv" }: Props) {
  const tr = getT(locale);
  const href = localePath(locale, `/portfolio/${piece.slug.current}`);

  const imageUrl = urlFor(piece.heroImage)
    .width(900)
    .height(1100)
    .fit("crop")
    .auto("format")
    .url();

  const blurUrl = urlFor(piece.heroImage)
    .width(20)
    .height(25)
    .fit("crop")
    .blur(50)
    .url();

  return (
    <Link
      href={href}
      className="group block mb-6 break-inside-avoid"
    >
      {/* Image container */}
      <div className="relative overflow-hidden bg-sand">
        <Image
          src={imageUrl}
          alt={piece.heroImage.alt ?? piece.title}
          width={900}
          height={1100}
          className="w-full object-cover transition-transform duration-700 ease-expo-out group-hover:scale-105"
          placeholder="blur"
          blurDataURL={blurUrl}
          priority={priority}
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
        />

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-forest/0 group-hover:bg-forest/20 transition-colors duration-500" />

        {/* Status badge — top right */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <StatusBadge status={piece.status} />
        </div>
      </div>

      {/* Card info */}
      <div className="mt-4 space-y-1">
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-serif text-xl text-forest group-hover:text-gold transition-colors duration-300">
            {piece.title}
          </h3>
          {piece.price && piece.status === "available" && (
            <span className="font-sans text-sm text-charcoal/50 whitespace-nowrap mt-1">
              {piece.price.toLocaleString("sv-SE")} kr
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <p className="font-sans text-xs tracking-widest uppercase text-charcoal/40">
            {tr.categories[piece.category as keyof typeof tr.categories] ?? piece.category}
          </p>
          {piece.year && (
            <>
              <span className="w-1 h-1 rounded-full bg-charcoal/20" />
              <p className="font-sans text-xs text-charcoal/40">{piece.year}</p>
            </>
          )}
        </div>

        {/* Visible status badge for sold/commission */}
        {(piece.status === "sold" || piece.status === "commission") && (
          <div className="pt-1">
            <StatusBadge status={piece.status} />
          </div>
        )}
      </div>
    </Link>
  );
}
