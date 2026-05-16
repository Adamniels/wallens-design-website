"use client";

import { useCart } from "@/context/CartContext";

export default function CartIcon() {
  const { itemCount, openDrawer } = useCart();

  return (
    <button
      onClick={openDrawer}
      aria-label={`Open shopping bag${itemCount > 0 ? `, ${itemCount} item${itemCount !== 1 ? "s" : ""}` : ""}`}
      className="relative flex items-center justify-center text-charcoal hover:text-gold transition-colors duration-300"
    >
      {/* Shopping bag SVG — minimal, luxury */}
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>

      {/* Item count badge — only shown when cart has items */}
      {itemCount > 0 && (
        <span
          className="absolute -top-2 -right-2 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-gold text-cream font-sans text-[10px] font-medium leading-none px-1"
          suppressHydrationWarning
        >
          {itemCount > 9 ? "9+" : itemCount}
        </span>
      )}
    </button>
  );
}
