"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import type { Locale } from "@/lib/i18n";

const copy = {
  sv: {
    addToCart: "Lägg i varukorg",
    added: "Tillagd",
    soldOut: "Slutsåld",
    alreadyMax: "Max antal i varukorg",
  },
  en: {
    addToCart: "Add to Bag",
    added: "Added",
    soldOut: "Sold Out",
    alreadyMax: "Max quantity in bag",
  },
} as const;

interface Props {
  /** Sanity _id for now — swapped for Stripe Price ID in Phase 3 */
  id: string;
  name: string;
  /** Display price in SEK */
  price: number;
  currency?: string;
  /** Pre-built absolute image URL */
  imageUrl: string;
  slug: string;
  /** Capped at stock count */
  maxQuantity: number;
  locale: Locale;
  /** "detail" = full-width primary CTA; "card" = compact secondary button */
  variant?: "detail" | "card";
}

export default function AddToCartButton({
  id,
  name,
  price,
  currency = "SEK",
  imageUrl,
  slug,
  maxQuantity,
  locale,
  variant = "detail",
}: Props) {
  const { addItem, items } = useCart();
  const t = copy[locale];

  const [justAdded, setJustAdded] = useState(false);

  // How many of this item are already in the cart
  const inCart = items.find((i) => i.id === id)?.quantity ?? 0;
  const atMax = inCart >= maxQuantity;

  // Reset "Added" state after 2 seconds
  useEffect(() => {
    if (!justAdded) return;
    const timer = setTimeout(() => setJustAdded(false), 2000);
    return () => clearTimeout(timer);
  }, [justAdded]);

  function handleClick() {
    if (atMax || justAdded) return;
    addItem({ id, name, price, currency, image: imageUrl, slug, maxQuantity });
    setJustAdded(true);
  }

  const isDisabled = atMax;
  const label = justAdded ? t.added : atMax ? t.alreadyMax : t.addToCart;

  if (variant === "detail") {
    return (
      <button
        onClick={handleClick}
        disabled={isDisabled}
        aria-label={label}
        className={`block w-full text-center font-sans text-sm tracking-widest uppercase px-6 py-4 transition-all duration-300 ${
          justAdded
            ? "bg-gold text-forest cursor-default"
            : isDisabled
            ? "bg-charcoal/10 text-charcoal/30 cursor-not-allowed"
            : "bg-forest text-cream hover:bg-forest-light"
        }`}
      >
        <span className="flex items-center justify-center gap-2">
          {justAdded && (
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
          {label}
        </span>
      </button>
    );
  }

  // Card variant — compact, outlined
  return (
    <button
      onClick={(e) => {
        // Prevent the parent link from navigating when clicking the button
        e.preventDefault();
        e.stopPropagation();
        handleClick();
      }}
      disabled={isDisabled}
      aria-label={label}
      className={`inline-flex items-center gap-1.5 font-sans text-[11px] tracking-widest uppercase px-4 py-2 border transition-all duration-300 ${
        justAdded
          ? "border-gold text-gold cursor-default"
          : isDisabled
          ? "border-charcoal/15 text-charcoal/25 cursor-not-allowed"
          : "border-forest/40 text-forest/70 hover:border-forest hover:bg-forest hover:text-cream"
      }`}
    >
      {justAdded ? (
        <>
          <svg
            width="11"
            height="11"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
          {label}
        </>
      ) : (
        <>
          {!isDisabled && (
            <svg
              width="11"
              height="11"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          )}
          {label}
        </>
      )}
    </button>
  );
}
