/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0C0C10",
        surface: "#15151B",
        "surface-hover": "#1C1C24",
        line: "#25252F",
        ink: "#F2F1ED",
        muted: "#8C8B97",
        accent: "#FF5A2B",
        "accent-soft": "#3A1F14",
        signal: "#43D9B8",
      },
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
};
