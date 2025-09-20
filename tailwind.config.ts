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
        "primary": "#2C3E50",
        "secondary": "#ECF0F1",
        "accent": "#3498DB",
        "destructive": "#CE4760",
      }
    },
  },
} satisfies Config;
