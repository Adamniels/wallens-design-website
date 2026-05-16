import type { Metadata } from "next";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { localePath } from "@/lib/i18n";
import CartClearer from "@/components/CartClearer";

export const metadata: Metadata = {
  title: "Order Confirmed",
  robots: { index: false },
};

const copy = {
  sv: {
    eyebrow: "Beställning bekräftad",
    headline: "Tack för din beställning",
    body: "Din betalning har behandlats. Du får ett bekräftelsemail inom kort med din orderinformation.",
    reference: "Orderreferens",
    backToCollection: "Tillbaka till kollektionen",
    questions: "Frågor om din beställning?",
    contactUs: "Kontakta oss",
  },
  en: {
    eyebrow: "Order confirmed",
    headline: "Thank you for your order",
    body: "Your payment has been processed. You will receive a confirmation email shortly with your order details.",
    reference: "Order reference",
    backToCollection: "Back to the collection",
    questions: "Questions about your order?",
    contactUs: "Contact us",
  },
} as const;

interface Props {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ session_id?: string }>;
}

export default async function CheckoutSuccessPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { session_id } = await searchParams;
  const t = copy[locale as Locale] ?? copy.en;
  const lp = (path: string) => localePath(locale as Locale, path);

  // Truncate session_id to a readable reference (last 12 chars)
  const orderRef = session_id
    ? session_id.replace("cs_", "").slice(-12).toUpperCase()
    : null;

  return (
    <section className="min-h-screen bg-cream flex items-center justify-center px-6 py-24">
      <CartClearer />
      <div className="max-w-md w-full text-center space-y-8">

        {/* Gold checkmark */}
        <div className="flex items-center justify-center">
          <div className="w-16 h-16 rounded-full border border-gold/40 flex items-center justify-center">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gold"
              aria-hidden="true"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        </div>

        {/* Text */}
        <div className="space-y-4">
          <p className="font-sans text-xs tracking-[0.25em] uppercase text-gold">
            {t.eyebrow}
          </p>
          <h1
            className="font-serif text-display-md text-forest"
            style={{ fontWeight: 300 }}
          >
            {t.headline}
          </h1>
          <div className="w-8 h-px bg-gold mx-auto" />
          <p className="font-sans text-sm text-charcoal/60 leading-relaxed max-w-sm mx-auto">
            {t.body}
          </p>
        </div>

        {/* Order reference */}
        {orderRef && (
          <div className="border border-sand px-6 py-4 inline-block">
            <p className="font-sans text-xs tracking-widest uppercase text-charcoal/40 mb-1">
              {t.reference}
            </p>
            <p className="font-sans text-sm text-charcoal tracking-widest">
              {orderRef}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-3 pt-2">
          <Link
            href={lp("/portfolio")}
            className="block w-full bg-forest text-cream font-sans text-xs tracking-widest uppercase text-center py-4 hover:bg-forest-light transition-colors duration-300"
          >
            {t.backToCollection}
          </Link>

          <p className="font-sans text-xs text-charcoal/40">
            {t.questions}{" "}
            <Link
              href={lp("/contact")}
              className="text-forest hover:text-gold transition-colors duration-200 underline underline-offset-2"
            >
              {t.contactUs}
            </Link>
          </p>
        </div>

      </div>
    </section>
  );
}
