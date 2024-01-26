import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontFamily: {
        lucky: ["Luckiest Guy", "sans-serif"],
      },
      colors: {
        "burrito-100": "#FFEDD6",
        "burrito-200": "#FFE4C2",
        "burrito-300": "#FFDCAD",
        "burrito-link": "#E37B0D",
        light: "#000000CC",
      },
    },
  },
  plugins: [],
};
export default config;
