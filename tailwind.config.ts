import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: {
            DEFAULT: "#0F172A",
            dark: "#0F172A",
            light: "#1E293B",
            muted: "#334155",
            accent: "#38bdf8",
          },
          pink: {
            DEFAULT: "#EC4899",
            dark: "#DB2777",
            gradientStart: "#EC4899",
            gradientEnd: "#E11D48",
            light: "#FDF2F8",
            border: "#FBCFE8",
          }
        },
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        outfit: ["var(--font-outfit)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
