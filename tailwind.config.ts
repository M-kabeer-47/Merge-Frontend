import type { Config } from "tailwindcss";
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        roboto: ["var(--font-roboto)"],
        raleway: ["var(--font-raleway)"],
      },
      colors: {
        primary: "var(--primary)",
        secondary: "var(--secondary)",
        accent: "var(--accent)",
        destructive: "var(--destructive)",
        heading: "var(--heading)",
        "para": "var(--para)",
        "para-muted": "var(--para-muted)",
        button: "var(--button)",
      },
    },
  },
} satisfies Config;
