"use client";

import { useState } from "react";
import type { CartItem } from "@/lib/cartTypes";
import type { Locale } from "@/lib/i18n";

const copy = {
  sv: {
    idle: "Gå till kassan",
    loading: "Behandlar...",
    genericError: "Kontrollera din anslutning och försök igen.",
  },
  en: {
    idle: "Proceed to Checkout",
    loading: "Processing...",
    genericError: "Check your connection and try again.",
  },
} as const;

interface Props {
  items: CartItem[];
  locale: Locale;
}

export default function CheckoutButton({ items, locale }: Props) {
  const t = copy[locale];
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleCheckout() {
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ id: i.id, quantity: i.quantity })),
          locale,
        }),
      });

      const data = (await res.json()) as { url?: string; error?: string };

      if (!res.ok || !data.url) {
        setStatus("error");
        setErrorMsg(data.error ?? t.genericError);
        return;
      }

      // Hand off to Stripe — browser navigates away
      window.location.href = data.url;
    } catch {
      setStatus("error");
      setErrorMsg(t.genericError);
    }
  }

  const isLoading = status === "loading";

  return (
    <div className="space-y-2">
      {/* Inline error message */}
      {status === "error" && errorMsg && (
        <p className="font-sans text-xs text-red-600 text-center leading-relaxed px-1">
          {errorMsg}
        </p>
      )}

      <button
        onClick={handleCheckout}
        disabled={isLoading}
        className={`flex items-center justify-center gap-2 w-full font-sans text-xs tracking-widest uppercase text-center py-4 transition-all duration-300 ${
          isLoading
            ? "bg-forest/60 text-cream/70 cursor-not-allowed"
            : "bg-forest text-cream hover:bg-forest-light"
        }`}
      >
        {isLoading ? (
          <>
            {/* Minimal spinner */}
            <svg
              className="animate-spin flex-shrink-0"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" opacity="0.25" />
              <path d="M21 12a9 9 0 0 0-9-9" strokeLinecap="round" />
            </svg>
            {t.loading}
          </>
        ) : (
          t.idle
        )}
      </button>
    </div>
  );
}
