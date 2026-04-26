import { backIn } from "framer-motion";
import type { Config } from "tailwindcss";
export default {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        roboto: ["'Inter'", "var(--font-roboto)"],
        raleway: ["'Inter'", "var(--font-raleway)"],
      },
      colors: {
        primary: "var(--primary)",
        secondary: "var(--secondary)",
        accent: "var(--accent)",
        destructive: "var(--destructive)",
        heading: "var(--heading)",
        para: "var(--para)",
        "para-muted": "var(--para-muted)",
        button: "var(--button)",
        background: "var(--background)",
        "main-background": "var(--main-background)",
        "light-border": "var(--light-border)",
        "sidebar-text": "var(--sidebar-text)",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
} satisfies Config;
