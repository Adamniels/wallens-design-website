import type { Metadata } from "next";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { localePath } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Payment Cancelled",
  robots: { index: false },
};

const copy = {
  sv: {
    eyebrow: "Betalning avbruten",
    headline: "Inget att oroa sig för",
    body: "Betalningen avbröts och inget har debiterats. Din varukorg är fortfarande intakt — du kan fortsätta shoppa när du är redo.",
    backToCollection: "Tillbaka till kollektionen",
    tryAgain: "Försök igen",
  },
  en: {
    eyebrow: "Payment cancelled",
    headline: "No worries",
    body: "The payment was cancelled and you have not been charged. Your bag is still intact — continue shopping whenever you are ready.",
    backToCollection: "Back to the collection",
    tryAgain: "Try again",
  },
} as const;

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function CheckoutCancelPage({ params }: Props) {
  const { locale } = await params;
  const t = copy[locale as Locale] ?? copy.en;
  const lp = (path: string) => localePath(locale as Locale, path);

  return (
    <section className="min-h-screen bg-cream flex items-center justify-center px-6 py-24">
      <div className="max-w-md w-full text-center space-y-8">

        {/* Subtle X mark */}
        <div className="flex items-center justify-center">
          <div className="w-16 h-16 rounded-full border border-sand-dark flex items-center justify-center">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              className="text-charcoal/30"
              aria-hidden="true"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </div>
        </div>

        {/* Text */}
        <div className="space-y-4">
          <p className="font-sans text-xs tracking-[0.25em] uppercase text-charcoal/40">
            {t.eyebrow}
          </p>
          <h1
            className="font-serif text-display-md text-forest"
            style={{ fontWeight: 300 }}
          >
            {t.headline}
          </h1>
          <div className="w-8 h-px bg-sand-dark mx-auto" />
          <p className="font-sans text-sm text-charcoal/60 leading-relaxed max-w-sm mx-auto">
            {t.body}
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-3 pt-2">
          <Link
            href={lp("/portfolio")}
            className="block w-full bg-forest text-cream font-sans text-xs tracking-widest uppercase text-center py-4 hover:bg-forest-light transition-colors duration-300"
          >
            {t.backToCollection}
          </Link>
        </div>

      </div>
    </section>
  );
}
