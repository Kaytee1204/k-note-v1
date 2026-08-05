import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        neonPink: {
          50: "#fff1f5",
          100: "#ffe4ed",
          200: "#fecddc",
          300: "#fda4bf",
          400: "#fb6e98",
          500: "#ff2d75", // Main BlackPink Accent
          600: "#e11d61",
          700: "#be124e",
          800: "#9e1243",
          900: "#84143d",
          950: "#4c041f",
        },
      },
      boxShadow: {
        glow: "0 0 20px rgba(255, 45, 117, 0.35)",
        glowSm: "0 0 10px rgba(255, 45, 117, 0.25)",
        glowLg: "0 0 30px rgba(255, 45, 117, 0.5)",
      },
      keyframes: {
        pulseGlow: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.85", transform: "scale(1.02)" },
        },
      },
      animation: {
        pulseGlow: "pulseGlow 3s infinite ease-in-out",
      },
    },
  },
  plugins: [],
};
export default config;
