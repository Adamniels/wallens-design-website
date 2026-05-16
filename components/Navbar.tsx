"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import type { Locale } from "@/lib/i18n";
import { getT, localePath, switchLocalePath } from "@/lib/i18n";

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Detect locale from the URL
  const locale: Locale = pathname.startsWith("/en") ? "en" : "sv";
  const tr = getT(locale);

  const lp = (path: string) => localePath(locale, path);
  const switchHref = switchLocalePath(locale, pathname);

  const navLinks = [
    { label: tr.nav.work, href: lp("/portfolio") },
    { label: tr.nav.commissions, href: lp("/commissions") },
    { label: tr.nav.about, href: lp("/about") },
    { label: tr.nav.contact, href: lp("/contact") },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-cream/95 backdrop-blur-sm border-b border-sand"
          : "bg-transparent"
      }`}
    >
      <div className="page-container flex items-center justify-between h-16 md:h-20">
        {/* Wordmark */}
        <Link
          href={lp("/")}
          className="font-serif text-xl md:text-2xl text-forest tracking-wide hover:text-gold transition-colors duration-300"
        >
          Wallens Design
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`font-sans text-sm tracking-widest uppercase transition-colors duration-300 ${
                pathname === link.href || pathname.startsWith(link.href + "/")
                  ? "text-gold"
                  : "text-charcoal hover:text-forest"
              }`}
            >
              {link.label}
            </Link>
          ))}

          {/* Language toggle */}
          <Link
            href={switchHref}
            className="font-sans text-xs tracking-widest uppercase text-charcoal/50 hover:text-forest border border-charcoal/20 hover:border-forest px-2.5 py-1 transition-all duration-300"
          >
            {tr.nav.langToggle}
          </Link>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          <span
            className={`block w-6 h-px bg-charcoal transition-all duration-300 ${
              menuOpen ? "translate-y-2 rotate-45" : ""
            }`}
          />
          <span
            className={`block w-6 h-px bg-charcoal transition-all duration-300 ${
              menuOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block w-6 h-px bg-charcoal transition-all duration-300 ${
              menuOpen ? "-translate-y-2 -rotate-45" : ""
            }`}
          />
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden bg-cream border-t border-sand overflow-hidden transition-all duration-500 ${
          menuOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="page-container flex flex-col gap-1 py-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`font-sans text-sm tracking-widest uppercase py-3 border-b border-sand/50 transition-colors duration-200 ${
                pathname === link.href || pathname.startsWith(link.href + "/")
                  ? "text-gold"
                  : "text-charcoal hover:text-forest"
              }`}
            >
              {link.label}
            </Link>
          ))}

          {/* Language toggle — mobile */}
          <Link
            href={switchHref}
            className="font-sans text-xs tracking-widest uppercase py-3 text-charcoal/50 hover:text-forest transition-colors duration-200"
          >
            {tr.nav.langToggle}
          </Link>
        </nav>
      </div>
    </header>
  );
}
