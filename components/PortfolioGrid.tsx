"use client";

import { useState } from "react";
import PieceCard from "./PieceCard";
import { PieceCard as PieceCardType, PieceCategory } from "@/sanity/queries";
import type { Locale } from "@/lib/i18n";
import { getT } from "@/lib/i18n";

interface Props {
  pieces: PieceCardType[];
  locale?: Locale;
}

export default function PortfolioGrid({ pieces, locale = "sv" }: Props) {
  const tr = getT(locale);
  const [active, setActive] = useState<PieceCategory | "all">("all");

  const CATEGORIES: { value: PieceCategory | "all"; label: string }[] = [
    { value: "all", label: locale === "sv" ? "Alla smycken" : "All Pieces" },
    { value: "rings", label: tr.categories.rings },
    { value: "necklaces", label: tr.categories.necklaces },
    { value: "earrings", label: tr.categories.earrings },
    { value: "bracelets", label: tr.categories.bracelets },
    { value: "brooches", label: tr.categories.brooches },
    { value: "commission", label: tr.categories.commission },
  ];

  const availableCategories = CATEGORIES.filter(
    (cat) => cat.value === "all" || pieces.some((p) => p.category === cat.value)
  );

  const filtered =
    active === "all" ? pieces : pieces.filter((p) => p.category === active);

  return (
    <div>
      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-12">
        {availableCategories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setActive(cat.value)}
            className={`font-sans text-xs tracking-widest uppercase px-5 py-2.5 border transition-all duration-300 ${
              active === cat.value
                ? "bg-forest text-cream border-forest"
                : "bg-transparent text-charcoal/60 border-sand-dark hover:border-forest hover:text-forest"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Masonry grid */}
      {filtered.length === 0 ? (
        <p className="font-sans text-sm text-charcoal/40 italic py-24 text-center">
          {locale === "sv"
            ? "Inga objekt i den här kategorin ännu."
            : "No pieces in this category yet."}
        </p>
      ) : (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6">
          {filtered.map((piece, i) => (
            <PieceCard key={piece._id} piece={piece} priority={i < 3} locale={locale} />
          ))}
        </div>
      )}
    </div>
  );
}
