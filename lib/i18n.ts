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
      work: "Kollektion",
      commissions: "Specialbeställningar",
      about: "Om",
      contact: "Kontakt",
      langToggle: "EN",
    },
    home: {
      eyebrow: "Fina smycken",
      headline1: "Varje smycke",
      headline2: "berättar en historia",
      body: "Handgjorda smycken och skräddarsydda beställningar. Varje piece skapad med omsorg och avsikt, designad att bäras livet ut.",
      ctaWork: "Utforska kollektionen",
      ctaCommission: "Specialbeställning",
      selectedWork: "Utvalda smycken",
      recentPieces: "Senaste kollektionen",
      viewAll: "Se hela kollektionen",
      bespoke: "Skräddarsytt",
      bespokeHeadline: "Något skapat just för dig",
      bespokeBody:
        "Varje beställning börjar med ett samtal. Berätta vad du har i åtanke, känslan och historien bakom det, och vi skapar något unikt som är helt ditt.",
      ctaBespoke: "Läs om specialbeställningar",
      scrollHint: "Scrolla för att utforska",
    },
    portfolio: {
      eyebrow: "Kollektion",
      headline: "Kollektionen",
      empty: "Inga objekt publicerade ännu",
      emptyLink: "admin-studion",
    },
    piece: {
      aboutPiece: "Om detta smycke",
      price: "Pris",
      materials: "Material",
      gemstones: "Stenar",
      weight: "Vikt",
      dimensions: "Mått",
      year: "År",
      height: "Höjd / Längd",
      width: "Bredd",
      depth: "Tjocklek",
      inquireCommission: "Förfrågan om specialbeställning",
      inquirePiece: "Förfrågan om detta smycke",
      inquireSecondary: "Fråga om detta smycke",
      backToAll: "Tillbaka till kollektionen",
      breadcrumbWork: "Kollektion",
      addToCart: "Lägg i varukorg",
      soldOut: "Slutsåld",
      stockLow: "Få kvar",
      added: "Tillagd",
    },
    about: {
      eyebrow: "Om",
      emptyHeadline: "Designern",
      workshop: "Ateliern",
      howIWork: "Mitt hantverk",
      workTogether: "Samarbeta",
      commissionCTA: "Intresserad av en specialbeställning?",
      getInTouch: "Kontakta oss",
      emptyNote: "Lägg till din historia i studion under",
      emptyNoteStrong: "Om-sidan",
    },
    commissions: {
      eyebrow: "Skräddarsydda smycken",
      headline: "Specialbeställningar",
      intro1:
        "Varje specialbeställning börjar med ett samtal. Vi vill förstå din vision, tillfället och känslan bakom smycket, innan en enda skiss ritas.",
      intro2:
        "Därifrån arbetar vi nära dig genom design, val av material och stenar, och tillverkning, och håller dig involverad i varje steg.",
      ctaStart: "Starta ett samtal",
      readyToTalk: "Redo att prata?",
      getInTouch: "Kontakta oss",
      steps: [
        {
          step: "01",
          title: "Samtal",
          body: "Berätta om din vision, tillfället och din tidslinje. Ingen brief är för grov för att börja med.",
        },
        {
          step: "02",
          title: "Design & Offert",
          body: "Vi tar fram skisser och en detaljerad offert. Inga överraskningar, allt är överenskommet innan arbetet börjar.",
        },
        {
          step: "03",
          title: "Tillverkning",
          body: "Ditt smycke skapas för hand i ateliern med de material och stenar vi valt tillsammans. Vi skickar lägesuppdateringar under hela processen.",
        },
        {
          step: "04",
          title: "Leverans",
          body: "Ditt färdiga smycke levereras noggrant förpackat, redo att bäras och älskas.",
        },
      ],
    },
    contact: {
      eyebrow: "Kontakta oss",
      headline: "Kontakt",
      intro:
        "Har du frågor om ett specifikt smycke, vill starta en specialbeställning, eller bara säga hej, använd formuläret nedan så återkommer vi inom en dag eller två.",
    },
    footer: {
      tagline: "Handgjort i Sverige",
    },
    categories: {
      rings: "Ringar",
      necklaces: "Halsband",
      earrings: "Örhängen",
      bracelets: "Armband",
      brooches: "Brosch",
      commission: "Specialbeställning",
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
      work: "Collection",
      commissions: "Custom Orders",
      about: "About",
      contact: "Contact",
      langToggle: "SV",
    },
    home: {
      eyebrow: "Fine Jewellery",
      headline1: "Every piece",
      headline2: "tells a story",
      body: "Handcrafted jewellery and bespoke commissions. Each piece made with intention, designed to be worn and cherished for a lifetime.",
      ctaWork: "Explore the Collection",
      ctaCommission: "Custom Orders",
      selectedWork: "Selected Pieces",
      recentPieces: "Recent pieces",
      viewAll: "View the Collection",
      bespoke: "Bespoke Jewellery",
      bespokeHeadline: "Something made just for you",
      bespokeBody:
        "Every custom order starts with a conversation. Tell us what you have in mind, the occasion, the feeling, the story, and we will create something entirely your own.",
      ctaBespoke: "Learn About Custom Orders",
      scrollHint: "Scroll to explore",
    },
    portfolio: {
      eyebrow: "Collection",
      headline: "The Collection",
      empty: "No pieces published yet",
      emptyLink: "admin studio",
    },
    piece: {
      aboutPiece: "About this piece",
      price: "Price",
      materials: "Materials",
      gemstones: "Gemstones",
      weight: "Weight",
      dimensions: "Dimensions",
      year: "Year",
      height: "Height / Length",
      width: "Width",
      depth: "Thickness",
      inquireCommission: "Inquire About a Custom Order",
      inquirePiece: "Inquire About This Piece",
      inquireSecondary: "Ask about this piece",
      backToAll: "Back to the Collection",
      breadcrumbWork: "Collection",
      addToCart: "Add to Bag",
      soldOut: "Sold Out",
      stockLow: "Only a few left",
      added: "Added",
    },
    about: {
      eyebrow: "About",
      emptyHeadline: "The designer",
      workshop: "The atelier",
      howIWork: "The craft",
      workTogether: "Work together",
      commissionCTA: "Looking for something bespoke?",
      getInTouch: "Get in Touch",
      emptyNote: "Add your story in the studio under",
      emptyNoteStrong: "About Page",
    },
    commissions: {
      eyebrow: "Bespoke Jewellery",
      headline: "Custom Orders",
      intro1:
        "Every custom order starts with a conversation. We want to understand your vision, the occasion, and the feeling behind the piece, before a single sketch is drawn.",
      intro2:
        "From there we work closely with you through design, material and stone selection, and crafting, keeping you involved at every stage.",
      ctaStart: "Start a Conversation",
      readyToTalk: "Ready to talk?",
      getInTouch: "Get in Touch",
      steps: [
        {
          step: "01",
          title: "Conversation",
          body: "Tell us about your vision, the occasion, and your timeline. No idea is too early or too rough to begin with.",
        },
        {
          step: "02",
          title: "Design & Quote",
          body: "We produce sketches and a detailed quote covering materials and stones. No surprises, everything is agreed before work begins.",
        },
        {
          step: "03",
          title: "Crafting",
          body: "Your piece is made by hand in the atelier using the materials and stones we chose together. We send progress updates throughout.",
        },
        {
          step: "04",
          title: "Delivery",
          body: "Your finished piece is delivered beautifully packaged, ready to be worn and loved.",
        },
      ],
    },
    contact: {
      eyebrow: "Get in Touch",
      headline: "Contact",
      intro:
        "Whether you have a question about a specific piece, want to start a custom order, or just want to say hello, use the form below and we will get back to you within a day or two.",
    },
    footer: {
      tagline: "Handcrafted in Sweden",
    },
    categories: {
      rings: "Rings",
      necklaces: "Necklaces",
      earrings: "Earrings",
      bracelets: "Bracelets",
      brooches: "Brooches",
      commission: "Custom Order",
    },
    status: {
      available: "Available",
      sold: "Sold",
      commission: "Custom Order",
      display: "Not for Sale",
    },
  },
} as const;

export type Translations = (typeof t)["sv"];

export function getT(locale: Locale): Translations {
  return t[locale] as unknown as Translations;
}
