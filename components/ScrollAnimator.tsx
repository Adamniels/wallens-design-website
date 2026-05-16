"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ScrollAnimator() {
  const pathname = usePathname();
  const ctxRef = useRef<gsap.Context | null>(null);

  useEffect(() => {
    // Clean up animations from the previous route
    if (ctxRef.current) {
      ctxRef.current.revert();
      ctxRef.current = null;
    }

    // Animations only run on the home page (Swedish: "/", English: "/en")
    const isHome = pathname === "/" || pathname === "/en";
    if (!isHome) return;

    const ctx = gsap.context(() => {
      // ── Hero entrance ────────────────────────────────────────────────────────
      const heroItems = gsap.utils.toArray<HTMLElement>(
        '[data-animate="hero-item"]'
      );
      if (heroItems.length) {
        gsap.fromTo(
          heroItems,
          { opacity: 0, y: 45 },
          { opacity: 1, y: 0, duration: 1, ease: "power3.out", stagger: 0.15, delay: 0.1 }
        );
      }

      const heroLines = gsap.utils.toArray<HTMLElement>(
        '[data-animate="hero-lines"]'
      );
      if (heroLines.length) {
        gsap.fromTo(heroLines, { opacity: 0 }, { opacity: 1, duration: 1, delay: 0.85 });
      }

      // ── Hero parallax ────────────────────────────────────────────────────────
      const heroSection = document.querySelector<HTMLElement>('[data-animate="hero"]');
      const heroContent = document.querySelector<HTMLElement>('[data-animate="hero-content"]');
      if (heroSection && heroContent) {
        gsap.to(heroContent, {
          y: -90,
          ease: "none",
          scrollTrigger: {
            trigger: heroSection,
            start: "top top",
            end: "bottom top",
            scrub: 1.5,
          },
        });
      }

      // ── Gold line draw ───────────────────────────────────────────────────────
      gsap.utils.toArray<HTMLElement>('[data-animate="line"]').forEach((el) => {
        gsap.from(el, {
          scaleX: 0,
          transformOrigin: "left center",
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 90%",
            toggleActions: "play none none reverse",
          },
        });
      });

      // ── Fade-up ──────────────────────────────────────────────────────────────
      gsap.utils.toArray<HTMLElement>('[data-animate="fade-up"]').forEach((el) => {
        gsap.from(el, {
          opacity: 0,
          y: 35,
          duration: 0.85,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            toggleActions: "play none none reverse",
          },
        });
      });

      // ── Cascade ──────────────────────────────────────────────────────────────
      gsap.utils.toArray<HTMLElement>('[data-animate="cascade"]').forEach((container) => {
        const children = Array.from(container.children) as HTMLElement[];
        if (!children.length) return;
        gsap.from(children, {
          opacity: 0,
          y: 40,
          duration: 0.75,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: {
            trigger: container,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        });
      });
    });

    ctxRef.current = ctx;

    return () => {
      ctx.revert();
      ctxRef.current = null;
    };
  }, [pathname]);

  return null;
}
