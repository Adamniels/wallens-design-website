"use client";

import { useState } from "react";
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import type { SanityImage } from "@/sanity/queries";
import { urlFor } from "@/sanity/image";

interface Props {
  images: SanityImage[];
  pieceTitle: string;
}

export default function PieceGallery({ images, pieceTitle }: Props) {
  const [lightboxIndex, setLightboxIndex] = useState(-1);

  // Build slides for YARL — full resolution, no cropping
  const slides = images.map((img) => ({
    src: urlFor(img).width(1600).auto("format").url(),
    alt: img.alt ?? pieceTitle,
  }));

  return (
    <>
      {/* ── Thumbnail strip ─────────────────────────────────────────────────── */}
      <div className="flex gap-3 overflow-x-auto pb-4 mb-12">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setLightboxIndex(i)}
            className="flex-shrink-0 w-44 aspect-[4/5] relative overflow-hidden bg-sand group cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            aria-label={`View image ${i + 1} of ${images.length}`}
          >
            <Image
              src={urlFor(img).width(400).height(500).fit("crop").auto("format").url()}
              alt={img.alt ?? `${pieceTitle} — image ${i + 1}`}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="176px"
            />
            <div className="absolute inset-0 bg-forest/0 group-hover:bg-forest/15 transition-colors duration-300" />
            {/* Zoom hint */}
            <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="w-7 h-7 rounded-full bg-charcoal/60 flex items-center justify-center">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <circle cx="5.5" cy="5.5" r="4" stroke="white" strokeWidth="1.2"/>
                  <path d="M3.5 5.5H7.5M5.5 3.5V7.5" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
                  <path d="M8.5 8.5L11 11" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* ── YARL lightbox overlay ────────────────────────────────────────────── */}
      <Lightbox
        open={lightboxIndex >= 0}
        index={lightboxIndex}
        close={() => setLightboxIndex(-1)}
        slides={slides}
        on={{ view: ({ index }) => setLightboxIndex(index) }}
        animation={{ fade: 250, swipe: 300 }}
        controller={{ closeOnBackdropClick: true }}
        carousel={{ finite: false, preload: 2 }}
        styles={{
          container: { backgroundColor: "rgba(30, 30, 28, 0.97)" },
        }}
      />
    </>
  );
}
