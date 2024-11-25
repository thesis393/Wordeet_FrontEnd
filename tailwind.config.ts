import type { Config } from "tailwindcss";
const { nextui } = require("@nextui-org/react");

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "#3730a3",
          100: "#e0e7ff",
          200: "#c7d2fe",
          300: "#a5b4fc",
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
        },
        dark: {
          DEFAULT: "#1C1B1F",
          100: "#484649",
          200: "#313033",
        }
      },
      scale: {
        101: "1.01",
        99: "0.99"
      },
      fontFamily: {
        'poppins': ['ui-sans-serif', 'poppins'],
      },
      screens: {
        'xs': '374px'
      }
    },
  },
  darkMode: "class",
  plugins: [nextui(),],
};
export default config;
