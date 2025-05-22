// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./styles/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          background: "var(--brand-background)",
          surface: "var(--brand-surface)",
          accent: "var(--brand-accent)",
          tertiary: "var(--brand-tertiary)",
          vsdark: "var(--brand-vsdarker)",
          vsdarker: "var(--brand-vsdarker)",
          sage: "var(--brand-sage)",
          text: {
            default: "var(--text-brand)",
            secondary: "var(--text-brand-secondary)",
            muted: "var(--text-muted)",
          },
        },
      },
      fontFamily: {
        electro: "var(--font-electro)",
        lora: "var(--font-lora)",
        exo: "var(--font-exo)",
        mont: "var(--font-mont)",
      },
      backgroundImage: {
        "gradient-gold":
          "linear-gradient(135deg, var(--accent), var(--accent-dark))",
        "gradient-glow": "linear-gradient(145deg, var(--glow), var(--faint))",
        "gradient-surface":
          "linear-gradient(to bottom, var(--surface), var(--background))",
      },
    },
  },
};

export default config; // <- This was missing!
