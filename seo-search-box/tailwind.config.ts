import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        pink: {
          DEFAULT: "#F53796",
          hover: "#ff4aa5",
        },
        navy: {
          DEFAULT: "#000022",
          light: "rgba(0, 0, 34, 0.95)",
        },
      },
      fontFamily: {
        heading: ["var(--font-bebas)", "sans-serif"],
        body: ["var(--font-space-grotesk)", "sans-serif"],
        mono: ["var(--font-space-mono)", "monospace"],
      },
      animation: {
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "blink": "blink 0.6s step-end infinite",
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": {
            boxShadow: "0 0 12px rgba(245, 55, 150, 0.4), 0 0 24px rgba(245, 55, 150, 0.2)",
          },
          "50%": {
            boxShadow: "0 0 18px rgba(245, 55, 150, 0.55), 0 0 30px rgba(245, 55, 150, 0.3)",
          },
        },
        "blink": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
