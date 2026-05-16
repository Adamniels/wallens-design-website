"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/lib/i18n";
import { getT, localePath } from "@/lib/i18n";

const strings = {
  sv: {
    tagline: "Fina smycken och skräddarsydda beställningar. Varje piece skapad med omsorg, designad att bäras livet ut.",
    navigate: "Navigera",
    getInTouch: "Kontakt",
    inquire: "Fråga om ett smycke",
    startCommission: "Starta en specialbeställning",
    rights: "Alla rättigheter förbehållna.",
  },
  en: {
    tagline: "Fine jewellery and bespoke commissions. Each piece made with intention, designed to last a lifetime.",
    navigate: "Navigate",
    getInTouch: "Get in Touch",
    inquire: "Inquire about a piece",
    startCommission: "Start a custom order",
    rights: "All rights reserved.",
  },
};

export default function Footer() {
  const pathname = usePathname();
  const locale: Locale = pathname.startsWith("/en") ? "en" : "sv";
  const tr = getT(locale);
  const t = strings[locale];
  const lp = (path: string) => localePath(locale, path);
  const year = new Date().getFullYear();

  const navLinks = [
    { label: tr.nav.work, href: lp("/portfolio") },
    { label: tr.nav.commissions, href: lp("/commissions") },
    { label: tr.nav.about, href: lp("/about") },
    { label: tr.nav.contact, href: lp("/contact") },
  ];

  return (
    <footer className="bg-forest text-cream/80">
      <div className="page-container py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {/* Brand column */}
          <div className="space-y-4">
            <p className="font-serif text-2xl text-cream tracking-wide">
              Wallens Design
            </p>
            <p className="font-sans text-sm leading-relaxed text-cream/60 max-w-xs">
              {t.tagline}
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <p className="font-sans text-xs tracking-widest uppercase text-gold">
              {t.navigate}
            </p>
            <nav className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="font-sans text-sm text-cream/70 hover:text-gold transition-colors duration-300"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <p className="font-sans text-xs tracking-widest uppercase text-gold">
              {t.getInTouch}
            </p>
            <div className="space-y-2">
              <Link
                href={lp("/contact")}
                className="block font-sans text-sm text-cream/70 hover:text-gold transition-colors duration-300"
              >
                {t.inquire}
              </Link>
              <Link
                href={lp("/commissions")}
                className="block font-sans text-sm text-cream/70 hover:text-gold transition-colors duration-300"
              >
                {t.startCommission}
              </Link>
            </div>
            {/* Gold decorative line */}
            <div className="w-12 h-px bg-gold mt-6" />
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-cream/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <p className="font-sans text-xs text-cream/40">
            &copy; {year} Wallens Design. {t.rights}
          </p>
          <p className="font-sans text-xs text-cream/30 italic font-serif">
            {tr.footer.tagline}
          </p>
        </div>
      </div>
    </footer>
  );
}
