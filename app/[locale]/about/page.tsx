import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { client } from "@/sanity/client";
import type { AboutPage as AboutPageData } from "@/sanity/queries";
import { aboutQuery } from "@/sanity/queries";
import { urlFor } from "@/sanity/image";
import PortableTextRenderer from "@/components/PortableTextRenderer";
import type { Locale } from "@/lib/i18n";
import { getT, localePath } from "@/lib/i18n";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const tr = getT(locale as Locale);
  return {
    title: tr.about.eyebrow,
    description:
      locale === "sv"
        ? "Historien bakom Wallens Design — designern, ateliern och filosofin bakom handgjorda smycken."
        : "The story behind Wallens Design — the designer, the atelier, and the approach to fine jewellery.",
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const tr = getT(locale as Locale);
  const lp = (path: string) => localePath(locale as Locale, path);
  const about = await client.fetch<AboutPageData | null>(aboutQuery);

  // Use locale-specific content with Swedish fallback
  const headline =
    locale === "en" && about?.headline_en
      ? about.headline_en
      : about?.headline;
  const subheadline =
    locale === "en" && about?.subheadline_en
      ? about.subheadline_en
      : about?.subheadline;
  const body =
    locale === "en" && about?.body_en?.length ? about.body_en : about?.body;

  if (!about || (!headline && !body)) {
    return (
      <>
        <section className="pt-36 pb-16 bg-cream">
          <div className="page-container">
            <p className="font-sans text-xs tracking-[0.25em] uppercase text-gold mb-4">
              {tr.about.eyebrow}
            </p>
            <h1
              className="font-serif text-display-lg text-forest mb-6"
              style={{ fontWeight: 300 }}
            >
              {tr.about.emptyHeadline}
            </h1>
            <div className="w-12 h-px bg-gold" />
          </div>
        </section>
        <section className="bg-cream pb-24">
          <div className="page-container">
            <p className="font-sans text-sm text-charcoal/40 italic">
              {tr.about.emptyNote}{" "}
              <strong className="text-charcoal/60">{tr.about.emptyNoteStrong}</strong>.
            </p>
          </div>
        </section>
      </>
    );
  }

  const hasPortrait = !!about.portrait;
  const hasWorkshopImages = about.workshopImages && about.workshopImages.length > 0;
  const hasValues = about.values && about.values.length > 0;

  return (
    <>
      {/* Page header */}
      <section className="pt-36 pb-0 bg-cream">
        <div className="page-container">
          <p className="font-sans text-xs tracking-[0.25em] uppercase text-gold mb-4">
            {tr.about.eyebrow}
          </p>
          <div className="w-12 h-px bg-gold" />
        </div>
      </section>

      {/* Portrait + headline */}
      <section className="bg-cream py-16 md:py-24">
        <div className="page-container">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_480px] gap-12 lg:gap-20 items-start">

            {/* Left: headline + subheadline + body */}
            <div className="order-2 lg:order-1">
              {headline && (
                <h1
                  className="font-serif text-display-lg text-forest mb-6 leading-tight"
                  style={{ fontWeight: 300 }}
                >
                  {headline}
                </h1>
              )}
              {subheadline && (
                <p className="font-sans text-base text-gold mb-8 leading-relaxed">
                  {subheadline}
                </p>
              )}
              {body && body.length > 0 && (
                <PortableTextRenderer value={body} />
              )}
            </div>

            {/* Right: portrait */}
            {hasPortrait && (
              <div className="order-1 lg:order-2 lg:sticky lg:top-28 self-start">
                <div className="relative aspect-[3/4] overflow-hidden bg-sand">
                  <Image
                    src={urlFor(about.portrait!)
                      .width(960)
                      .height(1280)
                      .fit("crop")
                      .auto("format")
                      .url()}
                    alt={about.portrait!.alt ?? "Portrait"}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 480px"
                    priority
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Workshop images strip */}
      {hasWorkshopImages && (
        <section className="bg-cream-dark py-16">
          <div className="page-container">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-8 h-px bg-gold" />
              <p className="font-sans text-xs tracking-[0.25em] uppercase text-gold">
                {tr.about.workshop}
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {about.workshopImages!.map((img, i) => (
                <div
                  key={i}
                  className={`relative overflow-hidden bg-sand ${
                    i === 0 ? "col-span-2 row-span-2 aspect-square" : "aspect-square"
                  }`}
                >
                  <Image
                    src={urlFor(img)
                      .width(600)
                      .height(600)
                      .fit("crop")
                      .auto("format")
                      .url()}
                    alt={img.alt ?? `Workshop image ${i + 1}`}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Craft values */}
      {hasValues && (
        <section className="bg-cream py-16 md:py-24">
          <div className="page-container">
            <div className="flex items-center gap-4 mb-12">
              <div className="w-8 h-px bg-gold" />
              <p className="font-sans text-xs tracking-[0.25em] uppercase text-gold">
                {tr.about.howIWork}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-3xl">
              {about.values!.map((value, i) => (
                <div key={i} className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="font-serif text-2xl text-gold/50">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="font-serif text-xl text-forest">
                      {value.title}
                    </h3>
                  </div>
                  <p className="font-sans text-sm text-charcoal/60 leading-relaxed pl-9">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-forest py-20">
        <div className="page-container">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <p className="font-sans text-xs tracking-[0.25em] uppercase text-gold mb-2">
                {tr.about.workTogether}
              </p>
              <h2
                className="font-serif text-3xl text-cream"
                style={{ fontWeight: 300 }}
              >
                {tr.about.commissionCTA}
              </h2>
            </div>
            <Link
              href={lp("/contact")}
              className="flex-shrink-0 border border-gold text-gold font-sans text-sm tracking-widest uppercase px-8 py-4 hover:bg-gold hover:text-forest transition-all duration-300"
            >
              {tr.about.getInTouch}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
