
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
        principalColor: "#10314b",
        firstColor: "#5086A8",
        secondColor: "#F1F1F1",
        thirdColor: "#75C4D2",
        fourthColor: "#9CBFCF",
        fifthColor: "#D8E3E8",
        sixthColor: "#8C9CBC",
        seventhColor: "#bfccdc",
        eighthColor: "#d8e3e8",
        ninthColor: "#bcc8d4"
      },
    },
  },
  plugins: [],
};
export default config;
