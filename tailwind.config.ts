// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class", // Enable class-based dark mode toggling
  content: [
    "./pages/**/*.{ts,tsx,js,jsx}",
    "./components/**/*.{ts,tsx,js,jsx}",
    "./app/**/*.{ts,tsx,js,jsx}",
    "./src/**/*.{ts,tsx,js,jsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Custom color palette mapped to CSS variables (see globals.css)
        header: "var(--header)",
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
          light: "var(--secondary-foreground)", // alias for foreground
          dark: "var(--secondary)", // alias for default
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
          light: "var(--accent-light)",
          dark: "var(--accent-dark)",
        },
        silver: {
          DEFAULT: "var(--silver)",
          light: "var(--silver-light)",
          dark: "var(--silver-dark)",
        },
        gold: {
          DEFAULT: "var(--gold)",
          light: "var(--gold-light)",
          dark: "var(--gold-dark)",
        },
        teal: {
          DEFAULT: "var(--teal)",
          light: "var(--teal-light)",
          dark: "var(--teal-dark)",
        },
        purple: {
          DEFAULT: "var(--purple)",
          light: "var(--purple-light)",
          dark: "var(--purple-dark)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "#fcfcfc", // always white for contrast
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
      },
      text: {
        foreground: "var(--text-foreground)",
        muted: "var(--text-muted)",
        mutedForeground: "var(--text-foreground)",
        accent: "var(--text-accent)",
        accentLight: "var(--text-accent-light)",
        accentDark: "var(--text-accent-dark)",
        silver: "var(--text-silver)",
      },
      borderRadius: {
        lg: "0.5rem",
        md: "calc(0.5rem - 2px)",
        sm: "calc(0.5rem - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [
    // (Optional) Add other first-party plugins if needed, e.g.:
    // require("@tailwindcss/forms"),
    // require("@tailwindcss/container-queries")
    //
    // Note: The old `tailwindcss-animate` plugin is deprecated for v4.
    // Instead, we import animations via CSS (see globals.css).
  ],
};

export default config;
