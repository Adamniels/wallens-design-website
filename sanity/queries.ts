import groq from "groq";

// ─── Shared types ────────────────────────────────────────────────────────────

export interface SanityImage {
  _type: "image";
  asset: { _ref: string; _type: "reference" };
  hotspot?: { x: number; y: number };
  alt?: string;
  caption?: string;
}

export interface PieceDimensions {
  height?: number;
  width?: number;
  depth?: number;
  note?: string;
}

export type PieceStatus = "available" | "sold" | "commission" | "display";
export type PieceCategory =
  | "rings"
  | "necklaces"
  | "earrings"
  | "bracelets"
  | "brooches"
  | "commission";

// ─── Piece (card / list view) ────────────────────────────────────────────────

export interface PieceCard {
  _id: string;
  title: string;
  slug: { current: string };
  category: PieceCategory;
  status: PieceStatus;
  price?: number;
  heroImage: SanityImage;
  featured: boolean;
  year?: number;
}

export const allPiecesQuery = groq`
  *[_type == "piece"] | order(order asc, _createdAt desc) {
    _id,
    title,
    slug,
    category,
    status,
    price,
    heroImage,
    featured,
    year
  }
`;

// Featured pieces for the homepage — falls back gracefully if none are marked featured
export const featuredPiecesQuery = groq`
  *[_type == "piece" && featured == true] | order(order asc) [0...6] {
    _id,
    title,
    slug,
    category,
    status,
    price,
    heroImage,
    featured,
    year
  }
`;

// Fallback: most recent pieces, used on homepage when nothing is marked featured
export const recentPiecesQuery = groq`
  *[_type == "piece"] | order(_createdAt desc) [0...3] {
    _id,
    title,
    slug,
    category,
    status,
    price,
    heroImage,
    featured,
    year
  }
`;

// ─── Piece (full detail view) ────────────────────────────────────────────────

export interface PieceDetail extends PieceCard {
  title_en?: string;
  images?: SanityImage[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  description?: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  description_en?: any[];
  materials?: string[];
  gemstones?: string[];
  dimensions?: PieceDimensions;
  weightGrams?: number;
}

export const pieceBySlugQuery = groq`
  *[_type == "piece" && slug.current == $slug][0] {
    _id,
    title,
    title_en,
    slug,
    category,
    status,
    price,
    heroImage,
    images,
    description,
    description_en,
    materials,
    gemstones,
    dimensions,
    weightGrams,
    year,
    featured
  }
`;

// Used for generateStaticParams
export const allPieceSlugsQuery = groq`
  *[_type == "piece" && defined(slug.current)] {
    "slug": slug.current
  }
`;

// ─── About page ──────────────────────────────────────────────────────────────

export interface AboutValue {
  title: string;
  description: string;
}

export interface AboutPage {
  headline?: string;
  headline_en?: string;
  subheadline?: string;
  subheadline_en?: string;
  portrait?: SanityImage;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body?: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body_en?: any[];
  workshopImages?: SanityImage[];
  values?: AboutValue[];
}

export const aboutQuery = groq`
  *[_type == "about" && _id == "about-singleton"][0] {
    headline,
    headline_en,
    subheadline,
    subheadline_en,
    portrait,
    body,
    body_en,
    workshopImages,
    values
  }
`;
