import type { Metadata } from "next";
import { Suspense } from "react";
import ContactForm from "@/components/ContactForm";
import type { Locale } from "@/lib/i18n";
import { getT } from "@/lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const tr = getT(locale as Locale);
  return {
    title: tr.contact.headline,
    description:
      locale === "sv"
        ? "Kontakta oss för att fråga om ett objekt eller starta en beställning."
        : "Get in touch to inquire about a piece or start a commission.",
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const tr = getT(locale as Locale);

  return (
    <>
      <section className="pt-36 pb-16 bg-cream">
        <div className="page-container">
          <p className="font-sans text-xs tracking-[0.25em] uppercase text-gold mb-4">
            {tr.contact.eyebrow}
          </p>
          <h1
            className="font-serif text-display-lg text-forest mb-6"
            style={{ fontWeight: 300 }}
          >
            {tr.contact.headline}
          </h1>
          <div className="w-12 h-px bg-gold" />
        </div>
      </section>

      <section className="bg-cream pb-24">
        <div className="page-container">
          <div className="max-w-xl">
            <p className="font-sans text-base text-charcoal/70 leading-relaxed mb-10">
              {tr.contact.intro}
            </p>

            <Suspense fallback={<div className="h-96" />}>
              <ContactForm />
            </Suspense>
          </div>
        </div>
      </section>
    </>
  );
}
