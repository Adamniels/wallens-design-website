export type Locale = "sv" | "en";
export const locales: Locale[] = ["sv", "en"];
export const defaultLocale: Locale = "sv";

// Build a path for the given locale.
// Swedish has no URL prefix; English uses /en.
export function localePath(locale: Locale, path = "/"): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  if (locale === "sv") return clean;
  return `/en${clean === "/" ? "" : clean}`;
}

// Return the equivalent path in the other locale.
export function switchLocalePath(locale: Locale, pathname: string): string {
  if (locale === "sv") {
    return `/en${pathname === "/" ? "" : pathname}`;
  }
  // Strip /en prefix
  const stripped = pathname.replace(/^\/en/, "") || "/";
  return stripped;
}

// ─── Translations ─────────────────────────────────────────────────────────────

const t = {
  sv: {
    nav: {
      work: "Arbeten",
      commissions: "Beställningar",
      about: "Om",
      contact: "Kontakt",
      langToggle: "EN",
    },
    home: {
      eyebrow: "Finsnickeri",
      headline1: "Varje objekt",
      headline2: "berättar en historia",
      body: "Handgjorda möbler och skräddarsytt träarbete. Byggt med intention, designat för att användas livet ut.",
      ctaWork: "Se arbeten",
      ctaCommission: "Starta en beställning",
      selectedWork: "Utvalda arbeten",
      recentPieces: "Senaste objekten",
      viewAll: "Se alla arbeten",
      bespoke: "Skräddarsytt",
      bespokeHeadline: "Något skapat just för dig",
      bespokeBody:
        "Varje beställning börjar med ett samtal. Berätta vad du har i åtanke — rummet, känslan, historien — och vi bygger något som passar perfekt.",
      ctaBespoke: "Läs om beställningar",
      scrollHint: "Scrolla för att utforska",
    },
    portfolio: {
      eyebrow: "Portfolio",
      headline: "Arbeten",
      empty: "Inga objekt publicerade ännu",
      emptyLink: "admin-studion",
    },
    piece: {
      aboutPiece: "Om detta objekt",
      price: "Pris",
      materials: "Material",
      dimensions: "Mått",
      year: "År",
      height: "Höjd",
      width: "Bredd",
      depth: "Djup",
      inquireCommission: "Förfrågan om beställning",
      inquirePiece: "Förfrågan om detta objekt",
      backToAll: "Tillbaka till alla arbeten",
      breadcrumbWork: "Arbeten",
    },
    about: {
      eyebrow: "Om",
      emptyHeadline: "Hantverkaren",
      workshop: "Verkstaden",
      howIWork: "Hur jag arbetar",
      workTogether: "Arbeta tillsammans",
      commissionCTA: "Intresserad av en beställning?",
      getInTouch: "Kontakta oss",
      emptyNote: "Lägg till din historia i studion under",
      emptyNoteStrong: "Om-sidan",
    },
    commissions: {
      eyebrow: "Skräddarsytt",
      headline: "Beställningar",
      intro1:
        "Varje beställning börjar med ett samtal. Vi vill förstå rummet, hur du lever i det och vad objektet behöver göra — innan en enda skiss ritas.",
      intro2:
        "Därifrån arbetar vi nära dig genom design, materialval och bygge — och håller dig involverad i varje steg.",
      ctaStart: "Starta ett samtal",
      readyToTalk: "Redo att prata?",
      getInTouch: "Kontakta oss",
      steps: [
        {
          step: "01",
          title: "Samtal",
          body: "Berätta om ditt rum, din vision och din tidslinje. Ingen brief är för grov för att börja med.",
        },
        {
          step: "02",
          title: "Design & Offert",
          body: "Vi tar fram skisser och en detaljerad offert. Inga överraskningar — allt är överenskommet innan arbetet börjar.",
        },
        {
          step: "03",
          title: "Bygge",
          body: "Ditt objekt byggs för hand i verkstaden. Vi skickar lägesuppdateringar under hela processen.",
        },
        {
          step: "04",
          title: "Leverans",
          body: "Vi levererar och installerar objektet själva, och ser till att allt är precis rätt.",
        },
      ],
    },
    contact: {
      eyebrow: "Kontakta oss",
      headline: "Kontakt",
      intro:
        "Har du frågor om ett specifikt objekt, vill starta en beställning, eller bara säga hej — använd formuläret nedan så återkommer vi inom en dag eller två.",
    },
    footer: {
      tagline: "Handgjort i Sverige",
    },
    categories: {
      furniture: "Möbler",
      commission: "Beställning",
      storage: "Förvaring",
      seating: "Sittmöbel",
      tables: "Bord",
      outdoor: "Utomhus",
    },
    status: {
      available: "Tillgänglig",
      sold: "Såld",
      commission: "Beställning",
      display: "Inte till salu",
    },
  },

  en: {
    nav: {
      work: "Work",
      commissions: "Commissions",
      about: "About",
      contact: "Contact",
      langToggle: "SV",
    },
    home: {
      eyebrow: "Fine Carpentry",
      headline1: "Every piece",
      headline2: "tells a story",
      body: "Handcrafted furniture and bespoke woodwork. Built with intention, designed to be used for a lifetime.",
      ctaWork: "View the Work",
      ctaCommission: "Start a Commission",
      selectedWork: "Selected Work",
      recentPieces: "Recent pieces",
      viewAll: "View all work",
      bespoke: "Bespoke Work",
      bespokeHeadline: "Something made just for you",
      bespokeBody:
        "Every commission starts with a conversation. Tell us what you have in mind — the space, the feeling, the story — and we will build something that fits perfectly.",
      ctaBespoke: "Learn About Commissions",
      scrollHint: "Scroll to explore",
    },
    portfolio: {
      eyebrow: "Portfolio",
      headline: "The work",
      empty: "No pieces published yet",
      emptyLink: "admin studio",
    },
    piece: {
      aboutPiece: "About this piece",
      price: "Price",
      materials: "Materials",
      dimensions: "Dimensions",
      year: "Year",
      height: "Height",
      width: "Width",
      depth: "Depth",
      inquireCommission: "Inquire About a Commission",
      inquirePiece: "Inquire About This Piece",
      backToAll: "Back to All Work",
      breadcrumbWork: "Work",
    },
    about: {
      eyebrow: "About",
      emptyHeadline: "The maker",
      workshop: "The workshop",
      howIWork: "How I work",
      workTogether: "Work together",
      commissionCTA: "Interested in a commission?",
      getInTouch: "Get in Touch",
      emptyNote: "Add your story in the studio under",
      emptyNoteStrong: "About Page",
    },
    commissions: {
      eyebrow: "Bespoke Work",
      headline: "Commissions",
      intro1:
        "Every commission starts with a conversation. We want to understand the space, the way you live in it, and what the piece needs to do — before a single sketch is drawn.",
      intro2:
        "From there we work closely with you through design, material selection, and build — keeping you involved at every stage.",
      ctaStart: "Start a Conversation",
      readyToTalk: "Ready to talk?",
      getInTouch: "Get in Touch",
      steps: [
        {
          step: "01",
          title: "Conversation",
          body: "Tell us about your space, your vision, and your timeline. No brief is too rough to start with.",
        },
        {
          step: "02",
          title: "Design & Quote",
          body: "We produce sketches and a detailed quote. No surprises — everything is agreed before work begins.",
        },
        {
          step: "03",
          title: "Build",
          body: "Your piece is built by hand in the workshop. We send progress updates throughout.",
        },
        {
          step: "04",
          title: "Delivery",
          body: "We deliver and install the piece ourselves, and make sure everything is exactly right.",
        },
      ],
    },
    contact: {
      eyebrow: "Get in Touch",
      headline: "Contact",
      intro:
        "Whether you have a question about a specific piece, want to start a commission, or just want to say hello — use the form below and we will get back to you within a day or two.",
    },
    footer: {
      tagline: "Handcrafted in Sweden",
    },
    categories: {
      furniture: "Furniture",
      commission: "Custom Commission",
      storage: "Storage",
      seating: "Seating",
      tables: "Tables",
      outdoor: "Outdoor",
    },
    status: {
      available: "Available",
      sold: "Sold",
      commission: "Commission",
      display: "Not for Sale",
    },
  },
} as const;

export type Translations = (typeof t)["sv"];

export function getT(locale: Locale): Translations {
  return t[locale] as unknown as Translations;
}
