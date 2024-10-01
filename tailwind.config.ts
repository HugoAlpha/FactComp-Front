
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
        firstColor: "#5086A8", //#5086a8 
        secondColor: "#F1F1F1", //##f1f1f1
        thirdColor: "#75C4D2",  //#75c4d2
        fourthColor: "#9CBFCF", //#9cbfcf
        fifthColor: "#D8E3E8",  //#9cbfcf
        sixthColor: "#8C9CBC", //#8c9cbc
        seventhColor: "#bfccdc",
        eighthColor: "#d8e3e8",
        ninthColor: "#bcc8d4"
        
      },
    },
  },
  plugins: [],
};
export default config;
