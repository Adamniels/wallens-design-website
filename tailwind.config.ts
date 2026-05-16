import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./sanity/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand palette — jewelry
        // "forest" kept as alias for Charcoal Black so all existing class names work unchanged
        forest: {
          DEFAULT: "#1B1B1B",
          light: "#3A3A3A",
          dark: "#111111",
        },
        gold: {
          DEFAULT: "#C5A57A",
          light: "#D4B896",
          dark: "#A8855C",
        },
        cream: {
          DEFAULT: "#F5F2ED",
          dark: "#EAE5DC",
        },
        sand: {
          DEFAULT: "#DDD2C3",
          dark: "#C9BBAA",
        },
        charcoal: {
          DEFAULT: "#1B1B1B",
          light: "#3A3A3A",
        },
        "silver-grey": "#BCC1C6",
        "dusty-coral": "#B98576",
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      fontSize: {
        // Display scale for headlines
        "display-xl": ["clamp(3rem, 7vw, 6rem)", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
        "display-lg": ["clamp(2.25rem, 5vw, 4rem)", { lineHeight: "1.1", letterSpacing: "-0.015em" }],
        "display-md": ["clamp(1.75rem, 3.5vw, 2.75rem)", { lineHeight: "1.15" }],
      },
      spacing: {
        "section": "6rem",
        "section-sm": "4rem",
      },
      maxWidth: {
        "content": "1280px",
        "prose-xl": "72ch",
      },
      transitionTimingFunction: {
        "expo-out": "cubic-bezier(0.16, 1, 0.3, 1)",
        "expo-in-out": "cubic-bezier(0.87, 0, 0.13, 1)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "line-draw": {
          "0%": { transform: "scaleX(0)", transformOrigin: "left" },
          "100%": { transform: "scaleX(1)", transformOrigin: "left" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) both",
        "fade-in": "fade-in 0.6s ease both",
        "line-draw": "line-draw 0.8s cubic-bezier(0.16, 1, 0.3, 1) both",
      },
    },
  },
  plugins: [],
};

export default config;
