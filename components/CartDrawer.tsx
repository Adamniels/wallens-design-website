"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/cartTypes";
import type { Locale } from "@/lib/i18n";
import { localePath } from "@/lib/i18n";

// Translations inline — keeps the drawer self-contained
const copy = {
  sv: {
    title: "Varukorg",
    empty: "Din varukorg är tom",
    emptyHint: "Lägg till smycken från kollektionen",
    browse: "Utforska kollektionen",
    subtotal: "Delsumma",
    checkout: "Gå till kassan",
    remove: "Ta bort",
    close: "Stäng",
    maxReached: "Max antal",
    items: (n: number) => (n === 1 ? "1 artikel" : `${n} artiklar`),
  },
  en: {
    title: "Shopping Bag",
    empty: "Your bag is empty",
    emptyHint: "Add pieces from the collection",
    browse: "Browse the collection",
    subtotal: "Subtotal",
    checkout: "Proceed to Checkout",
    remove: "Remove",
    close: "Close",
    maxReached: "Max stock",
    items: (n: number) => (n === 1 ? "1 item" : `${n} items`),
  },
} as const;

export default function CartDrawer() {
  const { items, isOpen, closeDrawer, removeItem, updateQuantity, subtotal, itemCount } =
    useCart();
  const pathname = usePathname();
  const locale: Locale = pathname.startsWith("/en") ? "en" : "sv";
  const t = copy[locale];
  const lp = (path: string) => localePath(locale, path);

  // Close on Escape key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDrawer();
    };
    if (isOpen) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, closeDrawer]);

  // Focus the close button when drawer opens for accessibility
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (isOpen) closeButtonRef.current?.focus();
  }, [isOpen]);

  // Derive the display currency from the first item (all items share one currency in practice)
  const currency = items[0]?.currency ?? "SEK";

  return (
    <>
      {/* Backdrop overlay */}
      <div
        aria-hidden="true"
        onClick={closeDrawer}
        className={`fixed inset-0 z-40 bg-charcoal/30 backdrop-blur-[2px] transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Drawer panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={t.title}
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-[400px] bg-cream shadow-2xl flex flex-col transition-transform duration-500 ease-expo-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-sand flex-shrink-0">
          <div>
            <h2 className="font-serif text-xl text-forest">{t.title}</h2>
            {itemCount > 0 && (
              <p className="font-sans text-xs text-charcoal/50 mt-0.5 tracking-wide">
                {t.items(itemCount)}
              </p>
            )}
          </div>
          <button
            ref={closeButtonRef}
            onClick={closeDrawer}
            aria-label={t.close}
            className="flex items-center justify-center w-8 h-8 text-charcoal/50 hover:text-charcoal transition-colors duration-200"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Item list — scrollable */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            /* Empty state */
            <div className="flex flex-col items-center justify-center h-full px-6 text-center gap-4">
              {/* Bag outline illustration */}
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-sand-dark"
                aria-hidden="true"
              >
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              <div>
                <p className="font-serif text-lg text-forest">{t.empty}</p>
                <p className="font-sans text-sm text-charcoal/50 mt-1">
                  {t.emptyHint}
                </p>
              </div>
              <Link
                href={lp("/portfolio")}
                onClick={closeDrawer}
                className="inline-flex items-center gap-2 font-sans text-xs tracking-widest uppercase text-forest border border-forest/30 px-5 py-3 hover:border-forest hover:bg-forest hover:text-cream transition-all duration-300 mt-2"
              >
                {t.browse}
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-sand px-6 py-2">
              {items.map((item) => {
                const atMin = item.quantity <= 1;
                const atMax = item.quantity >= item.maxQuantity;

                return (
                  <li key={item.id} className="py-5 flex gap-4">
                    {/* Product image */}
                    <Link
                      href={lp(`/portfolio/${item.slug}`)}
                      onClick={closeDrawer}
                      className="flex-shrink-0 w-20 h-20 bg-sand/40 overflow-hidden block"
                    >
                      {item.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1"
                            className="text-sand-dark"
                            aria-hidden="true"
                          >
                            <rect x="3" y="3" width="18" height="18" rx="1" />
                            <path d="M3 9l4-4 4 4 4-6 6 8" />
                          </svg>
                        </div>
                      )}
                    </Link>

                    {/* Item details */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          href={lp(`/portfolio/${item.slug}`)}
                          onClick={closeDrawer}
                          className="font-serif text-base text-forest leading-snug hover:text-gold transition-colors duration-200 truncate"
                        >
                          {item.name}
                        </Link>
                        {/* Remove button */}
                        <button
                          onClick={() => removeItem(item.id)}
                          aria-label={`${t.remove} ${item.name}`}
                          className="flex-shrink-0 text-charcoal/30 hover:text-charcoal/70 transition-colors duration-200 mt-0.5"
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            aria-hidden="true"
                          >
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                          </svg>
                        </button>
                      </div>

                      {/* Price */}
                      <p className="font-sans text-sm text-charcoal/60 mt-1">
                        {formatPrice(item.price, item.currency)}
                      </p>

                      {/* Quantity stepper */}
                      <div className="flex items-center gap-0 mt-3 w-fit border border-sand">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          disabled={atMin}
                          aria-label="Decrease quantity"
                          className={`w-8 h-8 flex items-center justify-center font-sans text-base transition-colors duration-200 ${
                            atMin
                              ? "text-charcoal/20 cursor-not-allowed"
                              : "text-charcoal/60 hover:text-charcoal hover:bg-sand/40"
                          }`}
                        >
                          <span aria-hidden="true">−</span>
                        </button>

                        <span className="w-8 h-8 flex items-center justify-center font-sans text-sm text-charcoal border-x border-sand">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          disabled={atMax}
                          aria-label={
                            atMax
                              ? t.maxReached
                              : "Increase quantity"
                          }
                          title={atMax ? t.maxReached : undefined}
                          className={`w-8 h-8 flex items-center justify-center font-sans text-base transition-colors duration-200 ${
                            atMax
                              ? "text-charcoal/20 cursor-not-allowed"
                              : "text-charcoal/60 hover:text-charcoal hover:bg-sand/40"
                          }`}
                        >
                          <span aria-hidden="true">+</span>
                        </button>
                      </div>

                      {/* Max stock indicator */}
                      {atMax && (
                        <p className="font-sans text-[11px] text-gold mt-1.5">
                          {t.maxReached}
                        </p>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Footer — only shown when cart has items */}
        {items.length > 0 && (
          <div className="flex-shrink-0 px-6 py-6 border-t border-sand space-y-4">
            {/* Subtotal row */}
            <div className="flex items-center justify-between">
              <span className="font-sans text-sm text-charcoal/60 tracking-wide">
                {t.subtotal}
              </span>
              <span className="font-serif text-xl text-forest">
                {formatPrice(subtotal, currency)}
              </span>
            </div>

            {/* Thin gold line */}
            <div className="w-full h-px bg-sand" />

            {/* Checkout button — Phase 3 will attach the real handler */}
            <Link
              href={lp("/checkout")}
              onClick={closeDrawer}
              className="block w-full bg-forest text-cream font-sans text-xs tracking-widest uppercase text-center py-4 hover:bg-forest-light transition-colors duration-300"
            >
              {t.checkout}
            </Link>

            <p className="font-sans text-[11px] text-charcoal/40 text-center tracking-wide">
              {locale === "sv"
                ? "Säker betalning via Stripe"
                : "Secure payment via Stripe"}
            </p>
          </div>
        )}
      </div>
    </>
  );
}
