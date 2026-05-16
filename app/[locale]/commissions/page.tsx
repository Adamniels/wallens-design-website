import type { Metadata } from "next";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { getT, localePath } from "@/lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const tr = getT(locale as Locale);
  return {
    title: tr.commissions.headline,
    description:
      locale === "sv"
        ? "Beställ ett skräddarsytt smycke — handgjorda specialbeställningar skapade utifrån din vision och din historia."
        : "Commission a bespoke piece of jewellery — handcrafted custom orders built around your vision and story.",
  };
}

export default async function CommissionsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const tr = getT(locale as Locale);
  const lp = (path: string) => localePath(locale as Locale, path);

  return (
    <>
      <section className="pt-36 pb-16 bg-cream">
        <div className="page-container">
          <p className="font-sans text-xs tracking-[0.25em] uppercase text-gold mb-4">
            {tr.commissions.eyebrow}
          </p>
          <h1
            className="font-serif text-display-lg text-forest mb-6"
            style={{ fontWeight: 300 }}
          >
            {tr.commissions.headline}
          </h1>
          <div className="w-12 h-px bg-gold" />
        </div>
      </section>

      <section className="bg-cream pb-24">
        <div className="page-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div className="space-y-6">
              <p className="font-sans text-base text-charcoal/70 leading-relaxed">
                {tr.commissions.intro1}
              </p>
              <p className="font-sans text-base text-charcoal/70 leading-relaxed">
                {tr.commissions.intro2}
              </p>
              <div className="pt-4">
                <Link
                  href={lp("/contact")}
                  className="inline-flex items-center gap-3 bg-forest text-cream font-sans text-sm tracking-widest uppercase px-8 py-4 hover:bg-forest-dark transition-colors duration-300"
                >
                  {tr.commissions.ctaStart}
                </Link>
              </div>
            </div>

            {/* Process steps */}
            <div className="space-y-8">
              {tr.commissions.steps.map(({ step, title, body }) => (
                <div key={step} className="flex gap-6">
                  <span className="font-serif text-3xl text-gold/40 leading-none mt-1 flex-shrink-0">
                    {step}
                  </span>
                  <div>
                    <h3 className="font-serif text-xl text-forest mb-2">{title}</h3>
                    <p className="font-sans text-sm text-charcoal/60 leading-relaxed">{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA band */}
      <section className="bg-forest py-20">
        <div className="page-container text-center">
          <h2
            className="font-serif text-display-md text-cream mb-6"
            style={{ fontWeight: 300 }}
          >
            {tr.commissions.readyToTalk}
          </h2>
          <Link
            href={lp("/contact")}
            className="inline-flex items-center gap-3 border border-gold text-gold font-sans text-sm tracking-widest uppercase px-8 py-4 hover:bg-gold hover:text-forest transition-all duration-300"
          >
            {tr.commissions.getInTouch}
          </Link>
        </div>
      </section>
    </>
  );
}
