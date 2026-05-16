"use client";

import { useSearchParams, usePathname } from "next/navigation";
import type { Locale } from "@/lib/i18n";

const strings = {
  sv: {
    name: "Namn",
    namePlaceholder: "Ditt namn",
    email: "E-post",
    emailPlaceholder: "din@epost.se",
    piece: "Objekt av intresse",
    piecePlaceholder: "Vilket objekt gäller din fråga? (valfritt)",
    message: "Meddelande",
    messagePlaceholder: "Berätta vad du har i åtanke...",
    note: "Formuläret aktiveras när API-rutten är konfigurerad.",
    send: "Skicka meddelande",
  },
  en: {
    name: "Name",
    namePlaceholder: "Your name",
    email: "Email",
    emailPlaceholder: "your@email.com",
    piece: "Piece of Interest",
    piecePlaceholder: "Which piece are you asking about? (optional)",
    message: "Message",
    messagePlaceholder: "Tell us what you have in mind...",
    note: "Form submission will be wired up once the API route is configured.",
    send: "Send Message",
  },
};

export default function ContactForm() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const pieceParam = searchParams.get("piece") ?? "";

  const locale: Locale = pathname.startsWith("/en") ? "en" : "sv";
  const t = strings[locale];

  return (
    <form className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block font-sans text-xs tracking-widest uppercase text-charcoal/50 mb-2">
            {t.name}
          </label>
          <input
            type="text"
            name="name"
            required
            className="w-full bg-transparent border border-sand-dark focus:border-forest outline-none px-4 py-3 font-sans text-sm text-charcoal placeholder:text-charcoal/30 transition-colors duration-200"
            placeholder={t.namePlaceholder}
          />
        </div>
        <div>
          <label className="block font-sans text-xs tracking-widest uppercase text-charcoal/50 mb-2">
            {t.email}
          </label>
          <input
            type="email"
            name="email"
            required
            className="w-full bg-transparent border border-sand-dark focus:border-forest outline-none px-4 py-3 font-sans text-sm text-charcoal placeholder:text-charcoal/30 transition-colors duration-200"
            placeholder={t.emailPlaceholder}
          />
        </div>
      </div>

      <div>
        <label className="block font-sans text-xs tracking-widest uppercase text-charcoal/50 mb-2">
          {t.piece}
        </label>
        <input
          type="text"
          name="piece"
          defaultValue={pieceParam}
          className="w-full bg-transparent border border-sand-dark focus:border-forest outline-none px-4 py-3 font-sans text-sm text-charcoal placeholder:text-charcoal/30 transition-colors duration-200"
          placeholder={t.piecePlaceholder}
        />
      </div>

      <div>
        <label className="block font-sans text-xs tracking-widest uppercase text-charcoal/50 mb-2">
          {t.message}
        </label>
        <textarea
          name="message"
          required
          rows={6}
          className="w-full bg-transparent border border-sand-dark focus:border-forest outline-none px-4 py-3 font-sans text-sm text-charcoal placeholder:text-charcoal/30 transition-colors duration-200 resize-none"
          placeholder={t.messagePlaceholder}
        />
      </div>

      <p className="font-sans text-xs text-charcoal/30 italic">
        {t.note}
      </p>

      <button
        type="submit"
        className="bg-forest text-cream font-sans text-sm tracking-widest uppercase px-10 py-4 hover:bg-forest-dark transition-colors duration-300"
      >
        {t.send}
      </button>
    </form>
  );
}
