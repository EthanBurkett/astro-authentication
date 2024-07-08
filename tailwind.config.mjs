import { nextui } from "@nextui-org/react";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundPosition: {
        "grad-pos-start": "0% 0%",
        "grad-pos-end": "20% 70%",
      },
      backgroundSize: {
        "grad-size": "300% 200%",
      },
      colors: {
        brand: {
          DEFAULT: "#ba52dd",
          100: "#c268e1",
          200: "#ba52dd",
          300: "#b13dd9",
          400: "#a829d3",
          500: "#9725be",
          600: "#8621a9",
          700: "#751d93",
          800: "#64197e",
          900: "#531469",
        },
        dark: {
          DEFAULT: "#0d0d0d",
          100: "#808080",
          200: "#737373",
          300: "#666666",
          400: "#595959",
          500: "#4d4d4d",
          600: "#404040",
          700: "#333333",
          800: "#262626",
          900: "#1a1a1a",
        },
        light: {
          DEFAULT: "#ffffff",
          100: "#ffffff",
          200: "#e6e6e6",
          300: "#ccc",
          400: "#b3b3b3",
          500: "#999",
          600: "#808080",
          700: "#666",
          800: "#4d4d4d",
          900: "#333",
        },
      },
    },
  },
  darkMode: "class",
  plugins: [nextui()],
};
